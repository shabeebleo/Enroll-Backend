const express = require('express');
const router = express.Router();
const { userRegister, userLogin } = require('../controllers/authController');

// Register a new student/admin
router.post('/register', userRegister);

// Login an existing student/admin
router.post('/login', userLogin);

module.exports = router;
