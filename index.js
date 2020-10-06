//require express
var express = require('express');
//require body-parser
var bodyParser= require('body-parser');
//require mongoose
var mongoose = require("mongoose");

//create express object, call express
var app = express();

//get port information
const port = process.env.PORT || 3000;

//tell application to use ejs for templates
app.set('view engine', 'ejs');
//make styles public
app.use(express.static("public"));
// tell app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// connection information for Mongo
const Todo = require('./models/todo.model');
const mongoDB =  'mongodb+srv://ShawnTaylor95:ZLdxFt640LonUlqI@cluster0.qxzy6.mongodb.net/todolist?retryWrites=true&w=majority'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//couple of items
var tasks = [];
//completed items
var completed = [];


// get homepage
app.get('/', function(req,res){
    //query to mongoDB for todos
    Todo.find(function(err, todo){
        if(err){
            console.log(err);
        }else{
            for(i = 0; i< todo.length; i++){
                if(todo[i].done){
                    completed.push(todo[i].item)
                }else{
                    tasks.push(todo[i].item)
                }
            }
        }
    });


//return something to homepage
    res.render('index', {tasks: tasks, completed: completed}); //add completed variable to ejs ex {a:a,b:b}
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
    //var completedTask = req.body.done;
    if(typeof removeTask === 'string'){
        tasks.splice(tasks.indexOf(removeTask),1);
        //completedTask = tasks.indexOf(removeTask),1;
        //completed.push(completedTask);
        //console.log(completedTask);
    }else if(typeof removeTask === 'object'){
        for(var i = 0; i< removeTask.length; i++){
            tasks.splice(tasks.indexOf(removeTask[i]),1);
        }
    }
    res.redirect('/');
});

//server setup
app.listen(port,function(){
    console.log('Listening on ' + port)
});