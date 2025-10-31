const express = require('express');
const axios = require('axios');
const { getDB } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const calculateVitalityIndex = (pH, tds) => {
  const phDeviation = Math.abs(pH - 7) * 10;
  const tdsContribution = tds / 10;
  const index = Math.max(0, Math.min(100, 100 - (phDeviation + tdsContribution)));
  return Math.round(index * 10) / 10;
};

const getStatus = (pH, tds) => {
  if (pH >= 6.8 && pH <= 8.2 && tds < 350) return 'safe';
  if (pH >= 6.5 && pH <= 8.5 && tds < 500) return 'moderate';
  return 'unsafe';
};

const getPurposeAnalysis = (pH, tds, temperature, purpose) => {
  const analysis = {
    purpose,
    suitability: '',
    recommendations: [],
    thresholds: {},
    status: 'safe'
  };

  switch(purpose) {
    case 'drinking':
      analysis.thresholds = { pH: [6.5, 8.5], tds: [0, 500], temp: [5, 25] };
      if (pH >= 6.5 && pH <= 8.5 && tds <= 500) {
        analysis.suitability = 'Suitable for drinking';
        analysis.status = 'safe';
      } else {
        analysis.suitability = 'Not suitable for drinking without treatment';
        analysis.status = 'unsafe';
        if (pH < 6.5) analysis.recommendations.push('pH too acidic. Neutralization required.');
        if (pH > 8.5) analysis.recommendations.push('pH too alkaline. Treatment needed.');
        if (tds > 500) analysis.recommendations.push('TDS exceeds WHO limit (500 ppm). Reverse osmosis recommended.');
      }
      if (temperature > 15) analysis.recommendations.push('Water temperature high. Cool storage recommended.');
      break;

    case 'agricultural':
      analysis.thresholds = { pH: [5.5, 9.0], tds: [0, 2000], temp: [10, 30] };
      if (pH >= 5.5 && pH <= 9.0 && tds <= 2000) {
        analysis.suitability = 'Suitable for irrigation';
        analysis.status = 'safe';
      } else {
        analysis.suitability = 'May affect crop growth';
        analysis.status = 'caution';
        if (pH < 5.5) analysis.recommendations.push('Acidic pH may harm sensitive crops. Add lime.');
        if (pH > 9.0) analysis.recommendations.push('High pH may reduce nutrient availability. Add sulfur.');
        if (tds > 2000) analysis.recommendations.push('High salinity. Use salt-tolerant crops or improve drainage.');
      }
      if (tds > 1000 && tds <= 2000) {
        analysis.recommendations.push('Moderate salinity. Monitor soil salinity levels.');
      }
      break;

    case 'river':
      analysis.thresholds = { pH: [6.5, 8.5], tds: [0, 1000], temp: [15, 28] };
      if (pH >= 6.5 && pH <= 8.5 && tds <= 1000 && temperature <= 28) {
        analysis.suitability = 'Healthy aquatic ecosystem';
        analysis.status = 'safe';
      } else {
        analysis.suitability = 'Ecosystem under stress';
        analysis.status = 'caution';
        if (pH < 6.5 || pH > 8.5) analysis.recommendations.push('pH outside normal range for aquatic life.');
        if (tds > 1000) analysis.recommendations.push('High TDS may affect aquatic biodiversity.');
        if (temperature > 28) analysis.recommendations.push('Thermal pollution detected. Harmful to fish and aquatic life.');
      }
      if (temperature > 30) {
        analysis.status = 'unsafe';
        analysis.recommendations.push('Critical thermal pollution! Immediate investigation needed.');
      }
      break;

    case 'industrial':
      analysis.thresholds = { pH: [6.0, 9.0], tds: [0, 3000], temp: [10, 40] };
      if (pH >= 6.0 && pH <= 9.0 && tds <= 3000) {
        analysis.suitability = 'Acceptable for industrial use';
        analysis.status = 'safe';
      } else {
        analysis.suitability = 'May cause equipment corrosion or scaling';
        analysis.status = 'caution';
        if (pH < 6.0) analysis.recommendations.push('Acidic water may corrode equipment. Neutralize before use.');
        if (pH > 9.0) analysis.recommendations.push('Alkaline water may cause scaling. Pre-treatment needed.');
        if (tds > 3000) analysis.recommendations.push('Very high TDS. May require demineralization for cooling systems.');
      }
      if (tds > 5000) {
        analysis.status = 'unsafe';
        analysis.recommendations.push('TDS too high for most industrial applications.');
      }
      break;

    default:
      analysis.suitability = 'General monitoring';
      analysis.status = 'safe';
  }

  return analysis;
};

router.get('/current', async (req, res) => {
  try {
    const firebaseUrl = process.env.FIREBASE_DB_URL;
    const purpose = req.query.purpose || 'general';
    
    const response = await axios.get(`${firebaseUrl}/BioLink_WaterData_Latest.json`);
    const data = response.data || {};

    const sensorData = {
      pH: data.pH || 7.0,
      tds: data.TDS || 200,
      temperature: data.Temperature || 25,
      timestamp: new Date().toISOString()
    };

    sensorData.vitalityIndex = calculateVitalityIndex(sensorData.pH, sensorData.tds);
    sensorData.status = getStatus(sensorData.pH, sensorData.tds);

    // Add purpose-specific analysis
    if (purpose !== 'general') {
      sensorData.purposeAnalysis = getPurposeAnalysis(
        sensorData.pH, 
        sensorData.tds, 
        sensorData.temperature, 
        purpose
      );
    }

    const db = getDB();
    await db.collection('sensor_logs').insertOne({
      ...sensorData,
      purpose,
      createdAt: new Date()
    });

    res.json(sensorData);
  } catch (error) {
    console.error('Sensor data fetch error:', error.message);
    res.status(500).json({ 
      message: 'Error fetching sensor data',
      mockData: {
        pH: 7.2,
        tds: 280,
        temperature: 24,
        vitalityIndex: 75.8,
        status: 'safe',
        timestamp: new Date().toISOString()
      }
    });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const db = getDB();

    const timeLimit = new Date(Date.now() - hours * 60 * 60 * 1000);

    const history = await db.collection('sensor_logs')
      .find({ createdAt: { $gte: timeLimit } })
      .sort({ createdAt: 1 })
      .toArray();

    res.json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Error fetching history data' });
  }
});

router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentData = await db.collection('sensor_logs')
      .find({ createdAt: { $gte: sevenDaysAgo } })
      .toArray();

    if (recentData.length === 0) {
      return res.json({
        trend: 'stable',
        insights: ['Insufficient data for analysis'],
        predictions: []
      });
    }

    const avgPH = recentData.reduce((sum, d) => sum + d.pH, 0) / recentData.length;
    const avgTDS = recentData.reduce((sum, d) => sum + d.tds, 0) / recentData.length;
    const avgTemp = recentData.reduce((sum, d) => sum + d.temperature, 0) / recentData.length;
    const avgVitality = recentData.reduce((sum, d) => sum + d.vitalityIndex, 0) / recentData.length;

    const latestData = recentData[recentData.length - 1];
    const tempChange = recentData.length > 5 
      ? latestData.temperature - recentData[recentData.length - 5].temperature 
      : 0;

    const insights = [];
    const predictions = [];
    const alerts = [];

    // Basic Quality Insights
    if (avgVitality > 80) insights.push('Water quality is excellent in the last 7 days.');
    else if (avgVitality > 60) insights.push('Water quality is good but can be improved.');
    else insights.push('Water quality needs immediate attention.');

    // Thermal Pollution Detection
    if (avgTemp > 30) {
      alerts.push({
        type: 'thermal_pollution',
        severity: 'high',
        message: 'Thermal pollution detected! Average temperature exceeds 30°C.',
        recommendation: 'Check for industrial discharge or shallow water depth.'
      });
      predictions.push('Possible thermal pollution from industrial discharge or climate warming.');
    } else if (avgTemp > 28) {
      alerts.push({
        type: 'thermal_warning',
        severity: 'medium',
        message: 'Temperature slightly elevated. Monitor for thermal stress.',
        recommendation: 'Investigate heat sources near water body.'
      });
    }

    if (Math.abs(tempChange) > 3) {
      alerts.push({
        type: 'temperature_fluctuation',
        severity: 'medium',
        message: `Rapid temperature change detected (${tempChange.toFixed(1)}°C).`,
        recommendation: 'Monitor for sudden environmental changes.'
      });
    }

    // TDS-based Water Suitability
    let tdsSuitability = '';
    if (avgTDS < 300) {
      tdsSuitability = 'Safe for drinking and irrigation';
      insights.push('✅ TDS levels are safe (<300 ppm).');
    } else if (avgTDS >= 300 && avgTDS <= 500) {
      tdsSuitability = 'Caution - Acceptable but monitor closely';
      alerts.push({
        type: 'tds_caution',
        severity: 'medium',
        message: 'TDS in caution range (300-500 ppm).',
        recommendation: 'Regular monitoring required. May need filtration for drinking.'
      });
    } else {
      tdsSuitability = 'Contaminated - Not suitable for drinking';
      alerts.push({
        type: 'tds_contamination',
        severity: 'high',
        message: 'TDS exceeds safe limits (>500 ppm). Water contaminated.',
        recommendation: 'Immediate action required. Do not use for drinking without treatment.'
      });
    }

    // pH-based Safety Banding
    let phSafety = '';
    if (avgPH >= 6.5 && avgPH <= 8.5) {
      phSafety = 'Normal - Safe for most uses';
      insights.push('✅ pH levels are within normal range (6.5-8.5).');
    } else if (avgPH < 6.5) {
      phSafety = 'Acidic - Alert';
      alerts.push({
        type: 'ph_acidic',
        severity: 'high',
        message: `pH is too acidic (${avgPH.toFixed(2)}). Below safe range.`,
        recommendation: 'Check for acid rain, industrial discharge, or organic decay.'
      });
      predictions.push('Acidic pH may indicate organic pollution or industrial chemical discharge.');
    } else {
      phSafety = 'Alkaline - Alert';
      alerts.push({
        type: 'ph_alkaline',
        severity: 'high',
        message: `pH is too alkaline (${avgPH.toFixed(2)}). Above safe range.`,
        recommendation: 'Check for mineral deposits, algal blooms, or chemical contamination.'
      });
      predictions.push('Alkaline pH may indicate mineral deposits or algal activity.');
    }

    // Pollution Type Prediction
    if (avgTDS > 500 && avgPH > 7.5) {
      predictions.push('🔬 Likely saline intrusion or mineral contamination (high TDS + alkaline pH).');
    } else if (avgTDS > 400 && avgPH < 6.5) {
      predictions.push('🏭 Possible industrial chemical pollution (high TDS + acidic pH).');
    } else if (avgPH < 6.5 && avgTemp > 25) {
      predictions.push('🌿 Probable organic pollution or decomposition (acidic pH + warm water).');
    } else if (avgTDS > 600) {
      predictions.push('🌊 Strong indication of saline intrusion (very high TDS).');
    }

    // Trend analysis
    const trendDirection = avgVitality > 70 ? 'improving' : avgVitality > 50 ? 'stable' : 'declining';

    res.json({
      trend: trendDirection,
      averages: {
        pH: Math.round(avgPH * 100) / 100,
        tds: Math.round(avgTDS),
        temperature: Math.round(avgTemp * 10) / 10,
        vitalityIndex: Math.round(avgVitality * 10) / 10
      },
      suitability: {
        tds: tdsSuitability,
        ph: phSafety
      },
      insights,
      predictions,
      alerts,
      thermalAnalysis: {
        avgTemperature: Math.round(avgTemp * 10) / 10,
        recentChange: Math.round(tempChange * 10) / 10,
        status: avgTemp > 30 ? 'Critical' : avgTemp > 28 ? 'Warning' : 'Normal'
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error generating analytics' });
  }
});

module.exports = router;
