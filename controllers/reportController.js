const PDFDocument = require('pdfkit');
const Consumption = require('../models/Consumption');
const calculateROI = require('../utils/calculateROI');

exports.generateReport = async (req, res) => {
  try {
    const historicalData = await Consumption.find({ userId: req.user.id, type: 'historical' });
    const totalConsumption = historicalData.reduce((total, entry) => total + entry.energyConsumed, 0);
    const { potentialSavings, roi } = calculateROI(totalConsumption, 0.20);

   
    const doc = new PDFDocument();

    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="energy_report.pdf"');

    
    doc.text('Reporte de Consumo Energético', { align: 'center' });
    doc.moveDown();
    doc.text(`Consumo total: ${totalConsumption.toFixed(2)} kWh`);
    doc.text(`Ahorro potencial: ${potentialSavings.toFixed(2)} kWh`);
    doc.text(`ROI estimado: ${roi}%`);
    doc.moveDown();
    doc.text('Recomendaciones:', { underline: true });
    doc.text('- Implementar paneles solares para ahorrar hasta un 20% del consumo energético.');

    
    doc.pipe(res);  
    doc.end();      
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
