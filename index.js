if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./DatabaseSchema/userSchema.js");
const port = 8080;

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js"); 
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const MONGO_URL =  process.env.ATLAS_DB_URL;

main().then(() => { console.log("Database Connected") }).catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
};

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET_KEY,
        
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log(err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listing", listingsRouter);
app.use("/listing/:id", reviewsRouter);
app.use("/", userRouter);

//CUSTOM ERROR HANDLING (MIDDLEWARE)

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode=500, message } = err;
    res.status(statusCode).send(message);
    next();
});

app.listen(port, () => {
    console.log("App is listening on port number 8080");
});