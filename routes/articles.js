
const express = require('express');
const router = express.Router();
//bring in Article model
let Article = require('../models/article');

//bring in User model
let User = require('../models/user');





//add article
router.get('/add',ensureAuthentication ,(req, res) => {
    res.render('add_article', {
        title: "add article "
    });


});

//handle the article link request dynamically through ID
//get single Article

router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        //how to use the _id to give us access to other fields
        User.findById(article.author, function (err, user ) {
            res.render('article', {
                article: article,
                author: user.name
            });
            
        });



    });

});

//load edit form

router.get('/edit/:id', ensureAuthentication, (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        //making it so people cant type in url to bypass authorization
        if(article.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');


        }

        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });

    });

});


//add submit post route
router.post('/add', (req, res) => {
    //checking that the user didnt leave sanything empty
    req.checkBody('title','Title is required').notEmpty();
    // req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //get errors
    let errors= req.validationErrors();
    console.log(errors);
    //if they exist render the add_article view page with title and errors
    if (errors){
        res.render('add_article',{
            title: 'Add Article',
            errors: errors
        });
    }else{

        //create new instance of our model
        let article = new Article();
        //gets the input puts it in variable
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;
//saves the input into the database if there are no errors and redirects to home page
        article.save((err) => {
            if (err) {
                console.log(err);
            } else {
                req.flash('success','Article Added');
                res.redirect('/');

            }

        });


    }



});

//update Submit post route

router.post('/edit/:id', (req, res) => {

    //set variable to an empty object

    let article = {};


    //gets the input puts it in variable
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    // query for updating
    let query = {_id: req.params.id};
    console.log(query);


//put the Model and update pass in the query and the data
    Article.update(query, article,(err) => {
        if (err) {

            console.log(err);
        } else {
            req.flash('success','Article edited');
            res.redirect('/');

        }

    })

});

router.delete('/:id', (req, res)=>{
    //access control
    if(!req.user._id){
        res.status(500).send();

    }



    let query = {_id:req.params.id};

    //access control so that only user can delete the Article
    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id){

            res.status(500).send();
        }else{
            Article.remove(query, (err)=>{
                if(err){
                    console.log(err);
                }
                res.send('Success');

            })
        }

    });


    console.log(query);





});

//Acess Control
function ensureAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();

    }else{
        req.flash('danger', 'please login');
        res.redirect('/users/login')
    }
}


// allows us to access the router from outside
module.exports = router;