//require express
var express = require('express');
//require body-parser
var bodyParser= require('body-parser');

//create express object, call express
var app = express();

//tell application to use ejs for templates
app.set('view engine', 'ejs');
// tell app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//couple of items
var tasks = ["make it to class", "take child to daycare"];

//completed items
var completed = ["extra work"];


// get homepage
app.get('/', function(req,res){
//return something to homepage
    res.render('index', {tasks: tasks}); //add completed variable to ejs ex {a:a,b:b}
});

//add post / addtask
app.post('/addtask', function(req,res){
    //create new variable
    var newTask = req.body.newtask;
    tasks.push(newTask);
    //redirects code to app.get so the code won't be redundant.. still pushes new task code to list on homepage
    res.redirect('/');
});

//remove tasks
app.post('/removetask', function(req,res){
    //push to completed
    var removeTask = req.body.check;
    if(typeof removeTask === 'string'){
        tasks.splice(tasks.indexOf(removeTask),1);
    }else if(typeof removeTask === 'object'){
        for(var i = 0; i< removeTask.length; i++){
            tasks.splice(tasks.indexOf(removeTask[i]),1);
        }
    }
    res.redirect('/');
});

//server setup
app.listen(3000,function(){
    console.log('Listening!')
});