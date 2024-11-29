const express = require('express');
const userRoutes = require('./user');
const christmasWishlistRoutes = require('./christmasWish');


const router = express.Router();

router.use('', userRoutes);
router.use('/christmaswish', christmasWishlistRoutes);

module.exports = router;
