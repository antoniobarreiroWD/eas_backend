const express = require('express');
const { addConsumption, getConsumption, getHistoricalData, getRecommendations } = require('../controllers/energyController');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

router.post('/add', authMiddleware, addConsumption);
router.get('/all', authMiddleware, getConsumption);
router.get('/historical', authMiddleware, getHistoricalData);
router.get('/recommendations', authMiddleware, getRecommendations);


module.exports = router;
