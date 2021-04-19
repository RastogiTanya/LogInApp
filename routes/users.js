var express = require('express');
const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;  
var router = express.Router();
var User = require('../models/user')
//Register
router.get('/register', function(req, res) {
  res.render('register');
});


router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/register', function(req, res) {
     var name= req.body.name;
      let email= req.body.email;
      let username= req.body.username;
      let password= req.body.password;
      let password2= req.body.password2;
      // console.log(name)

      //validations for form
      req.checkBody('name','name is needed').notEmpty();
      req.checkBody('email','email is needed').notEmpty();
      req.checkBody('email','email is not valid').isEmail();
      req.checkBody('username','username is needed').notEmpty();
      req.checkBody('password','password is needed').notEmpty();
      req.checkBody('password2','Passwords do not match').equals(req.body.password);

      var errors = req.validationErrors();

      if(errors){
        res.render('register',{
          errors: errors
        });
      }
      else{
          var newUser= new User({
            name: name,
            email: email,
            username: username,
            password: password
          });
          User.createUser(newUser,function(err,user){
            if(err) throw err;
            console.log(user);
          });
          req.flash('success_msg','you are registered');
          res.redirect('/users/login');
      }
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username,function(err,user){
      if(err) throw err;
      if(!user){
        return done(null,false,{message:'Unknown User'});
      }
      User.comparePassword(password,user.password,function(error,isMatch){
        if (error) throw error;
        if(isMatch)
        {
          return done(null,user);
        }
        else{
          return done(null,false,{message:'Invalid password'});
        }
      });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//from passport documentation , for authentication 
router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout',function(req,res){
  req.logout();
  req.flash('success_msg',"You are logged out");
  res.redirect('/users/login');
})
module.exports = router;