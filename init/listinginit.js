const mongoose = require('mongoose');

const Listing = require('../models/listing.js');

async function addListing() {
    await mongoose.connect('mongodb://localhost:27017/AHEGS'); // Replace with your database URL

    const newListing = new Listing({
        Name: 'John Doe',
        Roll_Number: '102',
        PRN_Number: '22210456',
        Class: '10',
        Subject: 'OS',
        MaxMarks: 8,
        Description: '',
        MarksObtained: '6',
        SubjectTeacher: new mongoose.Types.ObjectId('67812a612dc31f730e6efdf9'),
        __v: 0,
        StudentAnswerSheet: {
            url: 'uploads\\newfile123',
            filename: 'newfile123',
            context: 'Student’s answer content here'
        },
        IdealAnswerSheet: {
            url: 'uploads\\idealfile123',
            filename: 'idealfile123',
            context: 'Ideal answer content here'
        }
    });

    await newListing.save();
    console.log('Listing added successfully!');
}

addListing().catch(console.error);
