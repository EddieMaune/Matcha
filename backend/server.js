const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// const mongoose = require('mongoose');
const todoRoutes = express.Router();
// const Todo = require('./todo.model.js');
let db = null;//require('./connection');
const users = require("./routes/api/users");
const PORT = 4000;


// mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true , useUnifiedTopology: true});
// const connection = mongoose.connection;

// connection.once('open', function() {
//     console.log("MongoDB database connection established successfully");
// });
MongoClient.connect("mongodb://localhost:27017/matcha", { useUnifiedTopology: true }, function(err, client) {
  if(err) return console.error(err);

  db = client.db('matcha');
//   console.log(database);
  
//   console.log(db);

  // the Mongo driver recommends starting the server here because most apps *should* fail to start if they have no DB.  If yours is the exception, move the server startup elsewhere. 
});

app.use(cors());
app.use(bodyParser.json());
app.use('/todos', todoRoutes);

// console.log(users);
 app.use("/api/users", users);

todoRoutes.route('/').get(function(req, res, next) {
    ///console.log(db.collection('todos').find({}));

    

   
    db.collection('todos').find({}, function(err, docs) {
    //   if(err) 
    //     return next(err);
       docs.each(function(err, doc) {
        if(doc) {
          // console.log(doc);
        }
        else {
          res.end();
        }
        });
    });
    res.json("OK");
   });



// todoRoutes.route('/').get(function(req, res) {
//     Todo.find(function(err, todos) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(todos);
//         }
//     });
// });

// todoRoutes.route('/:id').get(function(req, res) {
//     let id = req.params.id;
//     Todo.findById(id, function(err, todo) {
//         res.json(todo);
//     });
// });

// todoRoutes.route('/add').post(function(req, res) {
//     let todo = new Todo(req.body);
//     todo.save()
//         .then(todo => {
//             res.status(200).json({'todo': 'todo added successfully'});
//         })
//         .catch(err => {
//             res.status(400).send('adding new todo failed');
//         });
// });

// todoRoutes.route('/update/:id').post(function(req, res) {
//     Todo.findById(req.params.id, function(err, todo) {
//         if (!todo)
//             res.status(404).send("data is not found");
//         else
//             todo.todo_description = req.body.todo_description;
//             todo.todo_responsible = req.body.todo_responsible;
//             todo.todo_priority = req.body.todo_priority;
//             todo.todo_completed = req.body.todo_completed;
//             todo.save().then(todo => {
//                 res.json('Todo updated!');
//             })
//             .catch(err => {
//                 res.status(400).send("Update not possible");
//             });
//     });
// });

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});