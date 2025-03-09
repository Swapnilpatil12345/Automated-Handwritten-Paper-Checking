const Listing = require("./models/listing");
const mongoose = require('mongoose');

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error',"You must be logged-in");
        return res.redirect('/login');
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    // Find the listing and populate the SubjectTeacher field
    let listing = await Listing.findById(id).populate('SubjectTeacher');

    // Check if the listing exists
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/papers');
    }

    // Check if the SubjectTeacher field is populated
    if (!listing.SubjectTeacher || !listing.SubjectTeacher._id.equals(res.locals.currUser._id)) {
        req.flash('error', `You don't have permission to perform this action`);
        return res.redirect(`/papers/${id}`);
    }
    next();
};

module.exports.isValidId = async(req,res,next) =>{
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', '404 No Page Found');
        return res.redirect('/papers');
    }
    next();
}