const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// Apply role middleware with 'Admin' role to all admin routes
router.use(roleMiddleware('Admin'));

// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/user/role', adminController.updateUserRole);
router.post('/permissions', adminController.assignPermissionToRole);

// Order management routes
router.get('/orders', adminController.getAllOrders);

// Game management routes
router.get('/games', adminController.getAllGames);
router.post('/games', adminController.addGame);
router.put('/games/:game_id', adminController.updateGame);
router.delete('/games/:game_id', adminController.deleteGame);

// Dashboard and reports
router.get('/dashboard', adminController.getDashboardStats);
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/users', adminController.getUsersReport);

module.exports = router;
