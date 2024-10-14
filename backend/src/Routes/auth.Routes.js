const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { signup, signin } = require('../Controllers/auth.Controllers');

// Input validation middleware
const signupValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const signinValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').exists().withMessage('Password is required'),
];

// Signup route
router.post('/signup', signupValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  signup(req, res, next);
});

// Signin route
router.post('/signin', signinValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  signin(req, res, next);
});

module.exports = router;
