const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError");
const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRoute = require("./routes/listings");
const reviewRoute = require("./routes/reviews");
const userRoute = require("./routes/users");
const MongoStore = require('connect-mongo');


const DB_URL = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("connected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
}



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) ;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));


const store = MongoStore.create({
    mongoUrl: DB_URL, 
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600, 
})

store.on("error", (error) => {
    console.log("ERROR in MONGO SESSION STORE", error)
})


const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());



// PASSPORT 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.listen(8080, () => {
    console.log("server is listening to port 8080");
})

app.get("/", (req, res) => {
    res.send("Hi i am root")
})



// LISTING ROUTES
app.use("/listings", listingRoute);


// REVIEW ROUTES
app.use("/listings/:id/reviews", reviewRoute);


// USER ROUTES
app.use("/", userRoute);




app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})



// Error handling middleware 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some error orruced" } = err;
    res.status(statusCode).render("error.ejs", { message });
})