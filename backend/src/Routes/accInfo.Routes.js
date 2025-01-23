const express = require('express');
const { 
    getAccountInfo, 
    updateUsername, 
    updateProfilePhoto, 
    updateDOB 
} = require('../Controllers/accInfo.Controllers');
const authMiddleware = require('../Middleware/authMiddleware');
const upload = require('../Middleware/multerMiddleware');
const router = express.Router();

// Routes
router.get('/account-info', authMiddleware, getAccountInfo);
router.put('/update-username', authMiddleware, updateUsername);
router.put('/update-photo', authMiddleware, upload.single('profilePhoto'), updateProfilePhoto);
router.put('/update-dob', authMiddleware, updateDOB);

module.exports = router;
