function calculateInstallationCost(averageConsumption) {
  const costPerMWh = 100; 

  const installationCost = averageConsumption * costPerMWh;
  return installationCost;
}

module.exports = calculateInstallationCost;
