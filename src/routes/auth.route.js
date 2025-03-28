const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/auth.controller');

const router = express.Router();

const { registerValidation, loginValidation } = require('../middlewares/validator.middleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;
