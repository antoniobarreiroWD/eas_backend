const Consumption = require('../models/Consumption');

const calculateAverageConsumption = async (userId) => {
  const historicalData = await Consumption.find({ userId, type: 'historical' });
  const totalConsumption = historicalData.reduce((total, entry) => total + entry.energyConsumed, 0);
  return historicalData.length ? totalConsumption / historicalData.length : 0;
};

module.exports = calculateAverageConsumption;
