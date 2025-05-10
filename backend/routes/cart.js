const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:userId', cartController.getCartByUser);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:cart_item_id', cartController.removeFromCart);
router.delete('/:userId/clear', cartController.clearCart);

module.exports = router;
