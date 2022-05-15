const express = require("express");
const router =  express.Router();
const authenticate = require("../midlleware/midlleware.js"); // Middlewares files


//Controllers
const AuthController = require('../controllers/authController.js');


router.get( '/', ( req , res ) => {
    res.send('How are you from router folder');
} );

router.post('/api/v1/signin', AuthController.signin);
router.post('/api/v1/formdata', authenticate, AuthController.formdata);
router.get('/api/v1/userFormData', authenticate, AuthController.userFormData);
router.get('/api/v1/userDetail', authenticate, AuthController.userDetail);


module.exports = router;