const subTeachers = require('../models/subteacher.js');
const listing = require('../models/listing.js');
const express = require("express");
const router = express.Router();

// const teacherController = require('../controllers/teacherController'); 


router.get('/dean', async (req, res) => { 
    const teachers = await subTeachers.find();
    res.render('../views/listings/dean.ejs', { teachers });
});



router.get('/subteacher/:teacherid', async (req, res) => {
    try {
        let { teacherid } = req.params;
        const teacher = await subTeachers.findOne({ teacherid });

        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }

        let allAnswerSheets = await listing.find();

        res.render('../views/listings/subjectTeacher.ejs', { teacher, listings: allAnswerSheets });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;