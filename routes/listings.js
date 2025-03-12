const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, isValidId } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router
  .route("/")
  .get(isLoggedin, wrapAsync(listingControllers.index)) // Index Route
  .post(isLoggedin, validateListing, wrapAsync(listingControllers.createRoute)); // Create Route

router.route("/summary").get(isLoggedin, wrapAsync(listingControllers.summary));

router.route("/new").get(isLoggedin, listingControllers.renderNewForm); // New Route

// const express = require("express");
// const router = express.Router();
const Listing = require("../models/listing");

// Analytics Route
router.get("/analytics", async (req, res) => {
    try {
        const currUser = req.user;
        
        if (!currUser) {
            return res.redirect("/login");
        }

        let totalStudents, avgMarks, highestMarks, lowestMarks;
        let subjectPerformance = {}, studentNames = [], studentScores = [];

        if (currUser.username.toLowerCase() === "dean") {
            // Fetch all students' analytics
            const allListings = await Listing.find({});
            totalStudents = allListings.length;
            
            const validMarks = allListings.map(lst => parseFloat(lst.MarksObtained)).filter(m => m >= 0);
            avgMarks = validMarks.length ? (validMarks.reduce((a, b) => a + b, 0) / validMarks.length).toFixed(2) : "N/A";
            highestMarks = Math.max(...validMarks, 0);
            lowestMarks = Math.min(...validMarks, 100);

            allListings.forEach(lst => {
                if (!subjectPerformance[lst.Subject]) subjectPerformance[lst.Subject] = [];
                subjectPerformance[lst.Subject].push(parseFloat(lst.MarksObtained));
            });
        } else {
            // Fetch analytics for a specific teacher
            const teacherListings = await Listing.find({ SubjectTeacher: currUser._id });
            totalStudents = teacherListings.length;

            const validMarks = teacherListings.map(lst => parseFloat(lst.MarksObtained)).filter(m => m >= 0);
            avgMarks = validMarks.length ? (validMarks.reduce((a, b) => a + b, 0) / validMarks.length).toFixed(2) : "N/A";
            highestMarks = Math.max(...validMarks, 0);
            lowestMarks = Math.min(...validMarks, 100);

            teacherListings.forEach(lst => {
                studentNames.push(lst.Name);
                studentScores.push(parseFloat(lst.MarksObtained));
            });
        }

        res.render("listings/analytics.ejs", {
            currUser,
            totalStudents, avgMarks, highestMarks, lowestMarks,
            subjectPerformance, studentNames, studentScores
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});



router
  .route("/:id")
  .get(isLoggedin, isValidId, wrapAsync(listingControllers.showRoute)) // Show Route
  .put(
    isLoggedin,
    isValidId,
    isOwner,
    wrapAsync(listingControllers.updateRoute)
  ) // Update Route
  .delete(
    isLoggedin,
    isValidId,
    isOwner,
    wrapAsync(listingControllers.deleteRoute)
  ); // Delete Route

router
  .route("/:id/studentanswersheet")
  .get(
    isLoggedin,
    isValidId,
    isOwner,
    wrapAsync(listingControllers.studentAnswerSheet)
  ) // Student Answer Sheet Upload Form
  .post(
    isLoggedin,
    isValidId,
    isOwner,
    upload.single("listing[StudentAnswerSheet]"),
    wrapAsync(listingControllers.studentAnswerSheetProcess)
  ); // Student Answer Sheet Process Route

router
  .route("/:id/idealanswersheet")
  .get(
    isLoggedin,
    isValidId,
    isOwner,
    wrapAsync(listingControllers.studentIdealAnswerSheet)
  ) // Student Ideal Answer Sheet Upload Form
  .post(
    isLoggedin,
    isValidId,
    isOwner,
    upload.single("listing[IdealAnswerSheet]"),
    wrapAsync(listingControllers.studentIdealAnswerSheetProcess)
  ); // Student Ideal Answer Sheet Process Route

router
  .route("/:id/fetchmarks")
  .get(
    isLoggedin,
    isValidId,
    isOwner,
    wrapAsync(listingControllers.fetchMarksForm)
  ) // fetch marks of student Form
  .post(
    isLoggedin,
    isValidId,
    isOwner,
    wrapAsync(listingControllers.fetchMarksProcess)
  ); // fetch marks of student Process Route

router
  .route("/:id/edit")
  .get(isLoggedin, isValidId, isOwner, wrapAsync(listingControllers.editRoute)); // Edit Route

router
  .route("/:id/editnext")
  .get(isLoggedin, isValidId, isOwner, wrapAsync(listingControllers.editNext)); // Edit Next Route

module.exports = router;
