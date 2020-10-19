var inquirer = require("inquirer");
var table = require("console.table");
var mysql = require("mysql");
const { start } = require("repl");

var connection = mysql.createConnection({
    host: "localhost",
    
    port: 3306,
    
    user: "root",
    
    password: "",
    database: "employeeTracker_db"
});

connection.connect(function(err) {
    if (err) throw err
    console.log("connected as id " + connection.threadId)
    console.log("Hello")
    start();
});

function start() [
    inquirer
    .prompt([
        name: "task",
        type: "list",
        message: "What would you like to do?"
        choices: [
            "Add Employee, Role, or Department"
            "View all Employees or Departments"
            "Update Roles or Managers"
            "Delete Employee"
            "Exit" 
        ]
    ])
    .then(function(answer) {
        switch (answer.task) {
            case "Add Employee, Role, or Department":
               addSomething();
               break;
           
            case "View all Employees or Departments": 
               viewSomething();
               break;
   
            case "Update Roles or Managers":
                updateSomething();
                break;
   
            case "Delete Employee":
                deleteEmployee();
                break;
   
            case "Exit":
                console.log("Connection Terminated!  Goodbye!")
                connection.end();
                
        }
    });
]