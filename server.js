var inquirer = require("inquirer");
var table = require("console.table");
var mysql = require("mysql");

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
    connection.end();
});