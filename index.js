//require express
var express = require('express');

//create express object, call express
var app = express();

//tell application to use ejs for templates
apps.set('view engine', 'ejs');

// get homepage
app.get('/', function(req,res){
//return something to homepage
    res.send('Hello World!');

});


//server setup
app.listen(3000,function(){
    console.log('Listening!')
});