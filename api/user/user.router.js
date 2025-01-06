const router = require("express").Router();
const { register, login, getProfile } = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');


router.post('/register', register);
router.post('/login', login);

module.exports = router;
