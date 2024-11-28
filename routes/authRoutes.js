const express = require('express');
const authController = require('../controllers/authControllers');
const router = express.Router();

router.get('/' , (req , res) =>{
    res.send("hello");;
});
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;