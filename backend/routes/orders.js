const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/:userId', orderController.getOrdersByUser);
router.post('/', orderController.placeOrder);
router.get('/details/:orderId', orderController.getOrderDetails);
router.put('/status/:orderId', orderController.updateOrderStatus);
router.post('/payment', orderController.processPayment);

module.exports = router;
