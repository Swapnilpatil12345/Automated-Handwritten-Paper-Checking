const { ref } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const studentInfo = new Schema({
    Name: {
        type:String,
        required:true
    },
    StudentAnswerSheet:{
        url: String,
        filename: String,
        context: String,
    },
    Roll_Number: String,
    PRN_Number: String,
    Class: {
        type:String,
        default:"10"
    },
    
    
    Subject: String,
    MaxMarks: Number,
    IdealAnswerSheet: {
        url: String,
        filename: String,
        context: String,
    },
    Description:String,
    MarkingScheme:String,
    Date:{
        type:Number,
        default:20130
    },
    
    SubjectTeacher: {
        type:Schema.Types.ObjectId,
        ref:'User',
    },

    MarksObtained: {
        type:String,
        default:'-1'
    },
})

const Listing = mongoose.model("Listing", studentInfo)

module.exports = Listing;