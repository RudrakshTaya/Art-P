const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { signup, signin, adminSignup, adminSignin } = require('../Controllers/auth.Controllers');


// Input validation middleware for user signup
const signupValidation = [
  body('username').notEmpty().withMessage('Username is required'), // Added username validation
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Input validation middleware for user signin
const signinValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').exists().withMessage('Password is required'),
];

// Input validation middleware for admin signup
const adminSignupValidation = [
  body('username').notEmpty().withMessage('Username is required'), // Added username validation
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Input validation middleware for admin signin
const adminSigninValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').exists().withMessage('Password is required'),
];

// User Signup route
router.post('/signup', signupValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  signup(req, res, next);
});

// User Signin route
router.post('/signin', signinValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  signin(req, res, next);
});

// Admin Signup route
router.post('/admin/signup', adminSignupValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  adminSignup(req, res, next);
});

// Admin Signin route
router.post('/admin/signin', adminSigninValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  adminSignin(req, res, next);
});

module.exports = router;
