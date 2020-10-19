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
                console.log("Your connection has been terminated. Have a nice day")
                connection.end();
                
        }
    });
]

function addSomething() {
    inquirer
      .prompt([
       {
        name: "add",
        type: "list",
        message: "What would you like to add?",
        choices: [
            "Department",
            "Role",
            "Employee"
        ]
       }
    ])
      .then(function(answer) {
        switch (answer.add) {
            case "Employee":
                addEmployee();
            break;
        
            case "Role":
                addRole();
            break;

            case "Department":
                addDepartment();
            break;
        }
    });
}

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, results) {
      connection.query("SELECT * FROM employee", function (err, res) {
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?"
          },
          
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?"    
          },
  
          {
            name: "role",
            type: "list",
            message: "What will be the role of the employee?",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].title);
              }
              return choiceArray;
            }
          },
  
          {
            name: "manager",
            type: "list",
            message: "Who is this employee's manager?",
            choices: function() {
              var managerArray = [];
              for (var i = 0; i < res.length; i++) {
                  managerArray.push(res[i].first_name + " " + res[i].last_name);
              }
              var none = "None";
              managerArray.push(none);
              return managerArray;
            }
  
          }
         
        ])
        .then(function(answer) {
            var firstName = answer.firstName;
            var lastName = answer.lastName;
            var str = answer.manager;
            manager = str.split(" ");
            var first = manager[0];
            var last = manager[1];
            if (answer.manager !== "None") {
              connection.query("SELECT id FROM employee WHERE ?", {last_name: last }, function (err, ans) {
                var managerAnswer = ans[0].id;
              connection.query("SELECT id FROM role WHERE ?", { title: answer.role }, function (err, res) {
                var roleAnswer = res[0].id;
                var query = connection.query(
                 "INSERT INTO employee SET ?",
                {
                 first_name: firstName,
                 last_name: lastName,
                 role_id: roleAnswer,
                 manager_id: managerAnswer
                },
                 function(err, res) {
                   if (err) throw err;
                   console.log("Successfully added employee");
                   start();
                 }           
                );
              
              });
             })
            } else {
             connection.query("SELECT id FROM role WHERE ?", { title: answer.role }, function (err, res) {
              var roleAnswer = res[0].id;
              var query = connection.query(
               "INSERT INTO employee SET ?",
              {
               first_name: firstName,
               last_name: lastName,
               role_id: roleAnswer
              },
               function(err, res) {
                 if (err) throw err;
                 console.log("Successfully added employee");
                 start();
               }           
              );
            
            });
        }
      });
    });
   });
}

function addRole() {
    connection.query("SELECT * FROM department", function(err, results) {
      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "What is the title of the role?"
          },
          
          {
            name: "salary",
            type: "input",
            message: "What is the annual salary?"    
          },
  
          {
            name: "department",
            type: "list",
            message: "What department does this role belong to?",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].name);
                }
                return choiceArray;
            }
          }
        ])
        .then(function(answer) {
            var title = answer.title;
            var salary = answer.salary;
            var departmentId = connection.query("SELECT id FROM department WHERE ?", { name: answer.department }, function(err, res) {
              var answer = res[0].id;
              var query = connection.query(
                "INSERT INTO role SET ?",
                {
                  title: title,
                  salary: salary,
                  department_id: answer
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("Successfully added role");
                    start();
                }
                          
               );
            }); 
            
            
        })
    });
}

function addDepartment() {
    inquirer
      .prompt([
        {
          name: "department",
          type: "input",
          message: "What is the name of the department you would like to add?"
        }
      ])
      .then(function(answer) {
          var department = answer.department;
          var query = connection.query(
           "INSERT INTO department SET ?",
           {
             name: department 
           },
           function(err, res) {
               if (err) throw err;
               console.log("Successfully added department");
               start();
           }           
          );
          
      })
}