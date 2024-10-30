const calculateROI = (savingsInEuros, installationCost) => {
  const roi = ((savingsInEuros - installationCost) / installationCost).toFixed(2);
  return { roi };
};

module.exports = calculateROI;

