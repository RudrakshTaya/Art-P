const express = require('express');
const { 
    getAccountInfo, 
    updateUsername, 
    updateProfilePhoto, 
    updateDOB 
} = require('../Controllers/accInfo.Controllers');

const { getOrderHistory } = require('../Controllers/orderHistory.Controllers');

const {addToWishlist,
    getWishlist,
    removeFromWishlist
} = require('../Controllers/wishList.Controllers')
const authMiddleware = require('../Middleware/authMiddleware');
const upload = require('../Middleware/multerMiddleware');
const router = express.Router();

//profile
router.get('/account-info', authMiddleware, getAccountInfo);
router.put('/update-username', authMiddleware, updateUsername);
router.put('/update-photo', authMiddleware, upload.single('profilePhoto'), updateProfilePhoto);
router.put('/update-dob', authMiddleware, updateDOB);

//Order
router.get('/order', authMiddleware, getOrderHistory);


//WishList
router.post('/wishlist', authMiddleware, addToWishlist);
router.get('/wishlist', authMiddleware, getWishlist);
router.delete('/wishlist/:productId', authMiddleware, removeFromWishlist);

module.exports = router;
