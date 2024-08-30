const express = require('express');
const router = express.Router();

const jwt = require("express-jwt");
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Add this line to verify the environment variable
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ["HS256"]
});

const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

router
    .route('/login')
    .post(authController.login);

router
    .route('/register')    
    .post((req, res, next) => {
        console.log('Register endpoint hit');
        authController.register(req, res, next);
    });

router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(auth, tripsController.tripsAddTrip);

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .post(tripsController.tripsAddTrip)
    .put(auth, tripsController.tripsUpdateTrip);

module.exports = router;
