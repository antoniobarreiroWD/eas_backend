
const calculateROI = (totalConsumption, renewableSavingsRate) => {
    
    const potentialSavings = totalConsumption * renewableSavingsRate;
    const costOfInvestment = 5000;
    const roi = (potentialSavings - costOfInvestment) / costOfInvestment;
  
    return {
      potentialSavings,
      roi: roi.toFixed(2) 
    };
  };
  
  module.exports = calculateROI;
  