const axios = require('axios');
const xml2js = require('xml2js');

const getAverageEnergyPrice = async (startDate, endDate) => {
  const areaCode = '10YES-REE------0';
  const apiKey = process.env.ENTSOE_API_KEY;

  try {
    const response = await axios.get('https://web-api.tp.entsoe.eu/api', {
      params: {
        securityToken: apiKey,
        documentType: 'A44',
        in_Domain: areaCode,
        periodStart: startDate,
        periodEnd: endDate
      }
    });

    const parsedData = await xml2js.parseStringPromise(response.data, { explicitArray: false });
    const document = parsedData.GL_MarketDocument || parsedData.Publication_MarketDocument;

    if (!document || !document.TimeSeries) {
      console.error('La respuesta no contiene datos de precios de energía:', parsedData);
      return null;
    }

    const prices = extractPrices(document);
    if (prices.length === 0) {
      console.warn('No se encontraron precios en la respuesta.');
      return null;
    }

    const averagePrice = prices.reduce((sum, item) => sum + item.price, 0) / prices.length;
    return averagePrice;
  } catch (error) {
    console.error('Error al obtener el precio de energía:', error.message);
    return null;
  }
};

const extractPrices = (document) => {
  const prices = [];
  const timeSeriesArray = Array.isArray(document.TimeSeries) ? document.TimeSeries : [document.TimeSeries];

  timeSeriesArray.forEach((entry) => {
    if (entry.Period && Array.isArray(entry.Period.Point)) {
      entry.Period.Point.forEach((point) => {
        if (point["price.amount"]) {
          prices.push({
            mRID: entry.mRID,
            position: point.position,
            price: parseFloat(point["price.amount"]),
          });
        }
      });
    }
  });

  return prices;
};

module.exports = { getAverageEnergyPrice };

