const express = require("express");
const path = require("path");
const Todo = require("./schema.js");
const mongoose = require("mongoose");
const server = express();

try{
  mongoose.connect("mongodb://127.0.0.1:27017/Todo_App");
}
catch(e)
{
  console.log("ERROR");
}
mongoose.connection.on("connected", ()=>
{
  console.log("DB CONNECTED")
})

mongoose.connection.on("ERROR",()=>
{
  console.log("DB CONNECTION ERROR");
})

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "/views"));
server.use(express.static(__dirname));
server.use(express.urlencoded());



//get task
server.get("/", (req, res) => {
  Todo.find({}, (err, tasks) => {
    if (err) {
      console.log("ERROR!!!");
      return;
    }
    return res.render("home.ejs", {
      task_list: tasks,
    });
  });
});


//create task
server.post("/create-task", (req, res) => {
  Todo.create(
    {
      title: req.body.title,
      description: req.body.desc,
      completed: "false",
    },
    (err, newTask) => {
      if (err) {
        console.log("ERROR!!!");
        return;
      }

      return res.redirect("back");
    }
  );
});


//update task(complete task)
server.get("/complete-task",(req,res)=>{
  let id=req.query.id;

  Todo.findByIdAndUpdate(id,{completed:"true"},(err)=>{
    if(err){
      console.log("ERROR!!!");
      return;
    }

  
    return res.redirect("back");
  })
}
)


//delete task
server.get("/del-task", (req, res) => {
  let id = req.query.id;
  Todo.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log("ERROR!!!!");
      return;
    }

    return res.redirect("back");
  });
});

server.listen(5000,()=>{
  console.log("server starting at 5000 port");
})
