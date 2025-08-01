if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); 
}

const dbUrl = process.env.ALASDB_URL || 'mongodb://127.0.0.1:27017/wanderlust';
console.log("Loaded DB URL:", dbUrl); 

const express = require("express"); //require express package
const app = express();   //starting express
const mongoose = require("mongoose");   //for connection with database.
const path = require("path");
const methodOverride = require("method-override");  //for using patch ,delete method.
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");    //for error handling
const session = require("express-session"); //for session management
const MongoStore = require('connect-mongo');
const flash = require("connect-flash"); //for flash messages
const passport = require("passport"); //for authentication
const LocalStrategy = require("passport-local"); //for local strategy authentication
const User = require("./models/user.js"); //for user model

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

//const dbUrl = process.env.ALASDB_URL
const defaultLink = 'mongodb://127.0.0.1:27017/wanderlust';
main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
    
})
const sessionoptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    }
}

// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");
// })

app.use(session(sessionoptions));
app.use(flash());

//setting up passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //using local strategy for authentication
passport.serializeUser(User.serializeUser()); //serializing user
passport.deserializeUser(User.deserializeUser()); //deserializing user

app.use((req, res, next) => { //this is for local variables that we pass any ejs page
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//    let fakeUser = new User({
//     email:"student@gmail.com",
//     username: "delta-student" 
//    })
//    let registeredUser = await User.register(fakeUser, "helloworld");
//    res.send(registeredUser);
// })

app.use("/listings",listingRouter); 
app.use("/listings/:id/reviews",reviewRouter); 
app.use("/",userRouter); 

app.all(/.*/, (req, res, next) => {      //handling error for all incorrect request page
    next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
});

const port = 3000;
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}/listings`);
})