//bring in express to our app
const express = require('express');
//core module needed
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config= require('./config/database');
const passport = require('passport');

//bring in Mongoose
const mongoose = require('mongoose');
//connect mongoose to our database
mongoose.connect(config.database);
//create an easy variable to the connected database
let db = mongoose.connection;

//check connection
db.once('open', () => {
    console.log('Connected to Mongo Db');

});

//check for db errors

db.on('error', (err) => {
    console.log(err);
});


//create a variable that calls express
// now we can use app to create handle requests
const app = express();

//Bring in model
let Article = require('./models/article');
let bodyParser = require('body-parser');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,

}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//express-validator middleware
const validatorOptions = {};

app.use(expressValidator(validatorOptions));

//passport Config need to use the passport value so we pass it in ie (passport)
require('./config/passport')(passport);

//passport moddleware
app.use(passport.initialize());
app.use(passport.session());

//global user variable (*) means all routes
app.get('*', (req,res,next)=>{
    res.locals.user = req.user|| null;
    next();
});




//Home route
app.get('/', (req, res) => {

    //will find all articles with the model implemented
    //passes in articles collection and renders it
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: "articles",
                articles: articles
            });
        }


    });


});



//Route Files
// puts all the routes in the variable
//then says that any thing that uses /articles will use that file
let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);





//allows server to start on port 3000
//Once it is running we can run npm start
//and our app.get will send the message
app.listen(3000, () => {
    console.log("app is listening on port 3000")

});

