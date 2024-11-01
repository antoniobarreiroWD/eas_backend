const Consumption = require('../models/Consumption');
const calculateROI = require('../utils/calculateROI');
const calculateInstallationCost = require('../utils/installationCostCalculator');
const { getAverageEnergyPrice } = require('../utils/energyPriceService');
const { formatDateToRequiredFormat } = require('../utils/dateUtils');
const calculateAverageConsumption = require('../utils/calculateAverageConsumption');

exports.addConsumption = async (req, res) => {
  try {
    const { energyConsumed, cost, year } = req.body;
    const consumption = new Consumption({
      userId: req.user.id,
      energyConsumed,
      cost,
      year,
    });
    await consumption.save();
    res.status(201).json(consumption);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getConsumption = async (req, res) => {
  try {
    const consumptions = await Consumption.find({ userId: req.user.id });
    res.json(consumptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHistoricalData = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const query = {
      userId: req.user.id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      type: 'historical',
    };

    const historicalData = await Consumption.find(query);
    const totalConsumption = historicalData.reduce((total, entry) => total + entry.energyConsumed, 0);
    const averageConsumption = historicalData.length ? totalConsumption / historicalData.length : 0;

    res.json({
      data: historicalData,
      metrics: {
        totalConsumption,
        averageConsumption,
        maxConsumption: Math.max(...historicalData.map(entry => entry.energyConsumed)),
        minConsumption: Math.min(...historicalData.map(entry => entry.energyConsumed)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  const renewableSavingsRate = 0.40;
  const { periodStart, periodEnd } = req.body;

  try {
    const startDate = formatDateToRequiredFormat(periodStart);
    const endDate = formatDateToRequiredFormat(periodEnd);
    const averageEnergyPrice = await getAverageEnergyPrice(startDate, endDate);

    if (!averageEnergyPrice) {
      return res.status(500).json({ error: 'No se pudo obtener el precio promedio de energía' });
    }

    const averageConsumption = await calculateAverageConsumption(req.user.id);
    const averageConsumptionMWh = averageConsumption / 1000; 

    const installationCost = calculateInstallationCost(averageConsumptionMWh);
    const potentialSavings = averageConsumptionMWh * renewableSavingsRate;
    const savingsInEuros = potentialSavings * averageEnergyPrice;

    const roi = calculateROI(savingsInEuros, installationCost);

   
    const paybackPeriod = installationCost / savingsInEuros;

    res.json({
      recommendations: [
        {
          suggestion: 'Implementar paneles solares',
          potentialSavings: potentialSavings.toFixed(2),
          savingsInEuros: savingsInEuros.toFixed(2),
          roi,
          installationCost,
          paybackPeriod: paybackPeriod.toFixed(2), 
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};








