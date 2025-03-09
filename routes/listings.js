const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedin, isOwner,isValidId } = require('../middleware.js');
const listingControllers = require('../controllers/listings.js');

const multer = require('multer')
const upload = multer({ dest:'uploads/' });

const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}


router
    .route('/')
    .get(isLoggedin,wrapAsync(listingControllers.index)) // Index Route 
    .post( isLoggedin,validateListing , wrapAsync(listingControllers.createRoute)); // Create Route 

router
    .route('/summary')
    .get(isLoggedin,wrapAsync(listingControllers.summary));

router
    .route('/new')
    .get(isLoggedin, listingControllers.renderNewForm) // New Route 

router
    .route('/:id')
    .get(isLoggedin,isValidId,wrapAsync(listingControllers.showRoute)) // Show Route 
    .put(isLoggedin,isValidId, isOwner, wrapAsync(listingControllers.updateRoute)) // Update Route 
    .delete(isLoggedin,isValidId, isOwner, wrapAsync(listingControllers.deleteRoute)) // Delete Route 

router
    .route('/:id/studentanswersheet')
    .get(isLoggedin,isValidId, isOwner,wrapAsync(listingControllers.studentAnswerSheet)) // Student Answer Sheet Upload Form
    .post(isLoggedin,isValidId, isOwner,upload.single('listing[StudentAnswerSheet]'),wrapAsync(listingControllers.studentAnswerSheetProcess)) // Student Answer Sheet Process Route

router
    .route('/:id/idealanswersheet')
    .get(isLoggedin,isValidId, isOwner,wrapAsync(listingControllers.studentIdealAnswerSheet)) // Student Ideal Answer Sheet Upload Form
    .post(isLoggedin,isValidId, isOwner,upload.single('listing[IdealAnswerSheet]'),wrapAsync(listingControllers.studentIdealAnswerSheetProcess)) // Student Ideal Answer Sheet Process Route

router
    .route('/:id/fetchmarks')
    .get(isLoggedin,isValidId, isOwner,wrapAsync(listingControllers.fetchMarksForm)) // fetch marks of student Form
    .post(isLoggedin,isValidId, isOwner,wrapAsync(listingControllers.fetchMarksProcess)) // fetch marks of student Process Route

router
    .route('/:id/edit')
    .get(isLoggedin,isValidId, isOwner, wrapAsync(listingControllers.editRoute)); // Edit Route

router
    .route('/:id/editnext')
    .get(isLoggedin,isValidId, isOwner, wrapAsync(listingControllers.editNext)) // Edit Next Route 


module.exports = router;