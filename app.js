var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const exphbs= require("express-handlebars");
const expressValidator= require("express-validator");
const flash = require("connect-flash");
const session = require ('express-session');
const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;
const mongo= require('mongodb');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
const db= mongoose.connection;

const routes=require('./routes/index');
const users= require('./routes/users');

//initializing the app
const app = express();
 //setting up view engine
app.set('views',path.join(__dirname,'views'))  //setting views directory
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//for serving static files
app.use(express.static(path.join(__dirname,'public')));


app.use(session({
      secret: 'secret',
      saveUninitialized: true,
      resave: true
    }));

//passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var namespace =param.split('.');
        var root = namespace.shift();
        var formParam=root;
        while(namespace.length){
            formParam+= '[' + namepsace.shift() +']';
        }
        return{
            param: formParam,
            msg : msg,
            value: value
        };
    }
}));
//connecting flash
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user= req.user || null;
    next();
  });
app.use('/', routes);
app.use('/users',users);


//setting port
app.set('port',(process.env.PORT || 3000));

//
app.listen(app.get('port'),function(){
    console.log('Server started on port')
})


