// const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

//bring in user model

const User = require('../models/user');

//bring in data base

const config = require('../config/database');

//bring in bcrypt so we can compare the hashed passwords

const bcrypt = require('bcryptjs');

//need to export all this functionality
module.exports = (passport)=>{
    //locaL Strategy

passport.use(new LocalStrategy(function(username, password, done){


    //match Username
    let query = {username: username};
    User.findOne(query, function(err, user){
        if (err) throw err;
        if(!user){
            return done(null,false,{message: 'No User Found'});
        }

        //Match Password
        bcrypt.compare(password, user.password, function(err, isMatch){
            if (err) throw err;
            if(isMatch){
                return done(null, user);

            }else {
                return done(null,false,{message: 'Wrong password'});
            }

        });
    });
}));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

};