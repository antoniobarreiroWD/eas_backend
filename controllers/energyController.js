const Consumption = require('../models/Consumption');
const calculateROI = require('../utils/calculateROI');
const { getAverageEnergyPrice } = require('../utils/energyPriceService');

exports.addConsumption = async (req, res) => {
  try {
    const { energyConsumed, cost } = req.body;
    const consumption = new Consumption({
      userId: req.user.id,
      energyConsumed,
      cost,
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
      type: 'historical'
    };

    const historicalData = await Consumption.find(query);

   
    const totalConsumption = historicalData.reduce((total, entry) => total + entry.energyConsumed, 0);
    const averageConsumption = historicalData.length ? (totalConsumption / historicalData.length) : 0;
    const maxConsumption = Math.max(...historicalData.map(entry => entry.energyConsumed));
    const minConsumption = Math.min(...historicalData.map(entry => entry.energyConsumed));

    res.json({
      data: historicalData,
      metrics: {
        totalConsumption,
        averageConsumption,
        maxConsumption,
        minConsumption
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  const renewableSavingsRate = 0.20; 
  const averageEnergyPrice = 0.15; 

  try {
    const historicalData = await Consumption.find({ userId: req.user.id, type: 'historical' });
    const totalConsumption = historicalData.reduce((total, entry) => total + entry.energyConsumed, 0);

    
    const { potentialSavings, roi } = calculateROI(totalConsumption, renewableSavingsRate);

    
    const savingsInEuros = potentialSavings * averageEnergyPrice;

    const recommendations = [
      {
        suggestion: 'Implementar paneles solares',
        potentialSavings: potentialSavings.toFixed(2),
        savingsInEuros: savingsInEuros.toFixed(2),
        roi: roi,
        description: 'Los paneles solares podrían reducir hasta un 20% del consumo total de energía.'
      },
    ];

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Datos dinámicos con la API de ENTSO-E

/* exports.getRecommendations = async (req, res) => {
  const renewableSavingsRate = 0.20; 

  try {
    
    const historicalData = await Consumption.find({ userId: req.user.id, type: 'historical' });
    
    if (historicalData.length === 0) {
      return res.status(404).json({ error: 'No historical data found for the user' });
    }

   
    const totalConsumption = historicalData.reduce((total, entry) => total + entry.energyConsumed, 0);

    
    const startDate = historicalData[0].date.toISOString().replace(/[-:]/g, '').slice(0, -5); 
    const endDate = historicalData[historicalData.length - 1].date.toISOString().replace(/[-:]/g, '').slice(0, -5); 

    
    const averageEnergyPrice = await getAverageEnergyPrice(startDate, endDate);

    
    const { potentialSavings, roi } = calculateROI(totalConsumption, renewableSavingsRate);

    
    const savingsInEuros = potentialSavings * averageEnergyPrice;

    const recommendations = [
      {
        suggestion: 'Implementar paneles solares',
        potentialSavings: potentialSavings.toFixed(2),
        savingsInEuros: savingsInEuros.toFixed(2),
        roi: roi,
        description: 'Los paneles solares podrían reducir hasta un 20% del consumo total de energía.'
      },
    ];

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */


