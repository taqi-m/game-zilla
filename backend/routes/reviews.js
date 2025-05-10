const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/game/:gameId', reviewController.getReviewsForGame);
router.post('/', reviewController.addReview);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;
