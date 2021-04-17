var express = require('express');
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

module.exports = router;