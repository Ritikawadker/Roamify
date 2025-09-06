const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const methodOverride = require('method-override');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// 1. Initialize view engine first
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Body parsing middleware (MUST come before routes)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Static files and method override
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride('_method'));

// 4. Database connection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main()
    .then(() => console.log("MongoDB connection successful"))
    .catch(err => console.error("MongoDB connection error:", err));

// 5. Session configuration
const sessionOptions = {
    secret: "mysecretsessionrequest",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

// 6. Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 7. Fixed debugging middleware (safe object check)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        console.log("Request Body:", req.body);
    }
    next();
});

// 8. Flash messages middleware
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// // 9. Routes
// app.get("/", (req, res) => {
//     res.send("This is my Root page");
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 10. Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});

// 11. Server start
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});