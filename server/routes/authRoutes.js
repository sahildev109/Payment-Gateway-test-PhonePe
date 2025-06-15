const express = require('express');
const {registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  getUserById} = require('../controllers/authController');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/user/:id', getUserById);
router.get('/check-auth', checkAuth);

module.exports = router;