
const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => { //if user perform sign up operaion then it automatically login , no need to explicitly login.
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{ //passport.Authenticate() middleware used for authentication before login. saveRedirectUrl saves from which page user wants to log in. 
req.flash("success","Welcome back to Wanderlust!");
let redirectUrl = res.locals.redirectUrl || "/listings"; //if user wants to login from a page , then after login we are redirect to the same page from where the user wants to log in. 

res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now!");
        res.redirect("/listings");
    })
}