const express = require('express');
const {payment,status}= require('../controllers/paymentController');
const router = express.Router();

router.post('/create', payment)
router.post('/status', status)


module.exports = router;