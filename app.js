if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const MONGO_URL = 'mongodb://127.0.0.1:27017/AHEGS';
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingsRouter = require('./routes/listings.js');
const userRouter = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const excelRoutes = require("./routes/excel.js"); // Adjust path if needed
const hierarchyRoutes = require('./routes/hierarchy'); // Adjust path if needed


main()
    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err);
    })


async function main() {
    await mongoose.connect(MONGO_URL);
    // await listing.insertMany(data);
}

// Set up middleware


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride('_method'));
app.use(express.json()); // Parse JSON data
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));


const sessionOptions = {
    secret:'MySecreat',
    resave:false,
    saveUninitialized :true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
    }
};

app.get('/', (req, res) => {
    res.redirect('/papers')
})


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    // console.log(req.user);
    next();
})




app.use('/',userRouter);
app.use('/papers',listingsRouter);
app.use('/excel', excelRoutes);
app.use('/', hierarchyRoutes);

app.all('*', (req, res, next) => {
    req.flash('error', '404 Page Not Found!!');
    res.redirect('/papers');
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    res.status(statusCode).send(message);
})


app.listen(8080, () => {
    console.log('App is listening to port 8080!')
})