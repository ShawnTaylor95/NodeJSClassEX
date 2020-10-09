//require express
var express = require('express');
//require body-parser
var bodyParser= require('body-parser');
//require mongoose
var mongoose = require("mongoose");
//require node fetch
var fetch = require('node-fetch');

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
app.get('/', function(req, res){
    //query to mongoDB for todos
    Todo.find(function(err, todo){
        if(err){
            console.log(err);
        }else{
            tasks = [];
            completed = [];
            for(i = 0; i< todo.length; i++){
                if(todo[i].done){
                    completed.push(todo[i])
                }else{
                    tasks.push(todo[i])
                }
            }
        }
    });


//return something to homepage
    res.render('index', {tasks: tasks, completed: completed}); //add completed variable to ejs ex {a:a,b:b}
});

//add post / addtask
app.post('/addtask', function(req, res){
    let newTodo = new Todo({
        item: req.body.newtask,
        done: false
    })
    newTodo.save(function(err, todo){
        if (err){
            console.log(err)
        } else {
            //return index
            res.redirect('/');
        }
    });
});

//remove tasks
app.post('/removetask', function(req, res){
    var id = req.body.check;
    if(typeof id === 'string'){
        Todo.updateOne({_id: id},{done:true},function(err){
            if(err){
                console.log(err)
            }
            res.redirect('/');
        })
    }else if(typeof id === 'object'){
        for (var i = 0; i < id.length; i++){
            Todo.updateOne({_id: id[i]},{done:true},function(err){
                if(err){
                    console.log(err)
                }
                res.redirect('/');
            })
        }
    }
    
});

app.post('/deleteCompleted', function(req, res){
    var id = req.body.delete;
    if(typeof id === 'string'){
        Todo.deleteOne({_id: id},function(err){
            if(err){
                console.log(err);
            }
        });
    }else if (typeof id === "object"){
        for(var i = 0; i < id.length; i++){
            Todo.deleteOne({_id: id[i]}, function(err){
            if (err){
                console.log(err)
            }
        });
        }
    }
    res.redirect('/');
});

//fetch nasa information and send to front end as JSON data
app.get('/nasa', function(req,res){
    let nasaData;
    fetch('https://api.nasa.gov/planetary/apod?api_key=QLzCHpxOPVNRfdy6dO8zpelNyIYRQkE6OCVZcVLr')
    .then(res => res.json())
    .then(data => {
        nasaData = data;
        res.json(nasaData);
    });
});

//get our data for the todo list from mongo and send to front end as JSON
app.get('/todoListJson', function(req, res){
    //query to mongoDB for todos
    Todo.find(function(err, todo){
        if(err){
            console.log(err);
        }else{
           res.json(todo);
        }
    });

});

//server setup
app.listen(port,function(){
    console.log('Listening on ' + port)
});