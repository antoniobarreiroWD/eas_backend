const axios = require('axios');
const xml2js = require('xml2js'); 


const getAverageEnergyPrice = async (startDate, endDate) => {
  const areaCode = '10YES-REE------0'; 

  try {
    const response = await axios.get('https://web-api.tp.entsoe.eu/api', {
      params: {
        securityToken: process.env.ENTSOE_API_KEY, 
        documentType: 'A44',                       
        in_Domain: areaCode,
        periodStart: startDate,                   
        periodEnd: endDate                         
      }
    });

    
    const parsedData = await xml2js.parseStringPromise(response.data, { explicitArray: false });
    const prices = extractPrices(parsedData);

   
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    return averagePrice;
  } catch (error) {
    console.error('Error al obtener el precio de energía:', error.message);
    return 0.15; 
  }
};


const extractPrices = (data) => {
  const prices = [];
  try {
    
    const timeseries = data.GL_MarketDocument.TimeSeries;
    if (Array.isArray(timeseries)) {
      timeseries.forEach(series => {
        series.Period.Point.forEach(point => {
          prices.push(parseFloat(point.quantity));
        });
      });
    } else {
      timeseries.Period.Point.forEach(point => {
        prices.push(parseFloat(point.quantity));
      });
    }
  } catch (error) {
    console.error('Error al extraer precios:', error.message);
  }
  return prices;
};

module.exports = { getAverageEnergyPrice };
