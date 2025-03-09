const { number, required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const subTeacherSchema = new Schema({
    teacherid:{
        type: Number,
        required: true,
        default:0
    },
    name: {
        type: String,
        required: true
    },
    subject: {
        type: [String],
        required: true
    },
    assignedClasses: {
        type: [String]  // Array of class names or IDs
    },
    branch: {
        type:String
    },
    email: {
        type: String,
        unique: true
    }
});

// Add authentication plugin
subTeacherSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model('SubTeachers', subTeacherSchema);
