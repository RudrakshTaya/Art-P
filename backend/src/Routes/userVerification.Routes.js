const express = require('express');
const { sendVerificationEmail, verifyEmail, forgotPassword, resetPassword } = require('../Controllers/userVerification');
const router = express.Router();

router.post('/send-verification-email', sendVerificationEmail);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
