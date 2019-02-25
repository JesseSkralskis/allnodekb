//creating model for our data

let mongoose = require('mongoose');

//article schema

let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true

    },
    body: {
        type: String,
        required: true
    }

});

//create variable that allows us to connect our db to the schema

let Article = module.exports = mongoose.model('Article',articleSchema);



