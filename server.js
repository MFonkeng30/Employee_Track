const inquirer = require("inquirer");
const table = require("console.table");
const mysql = require("mysql");
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
                   console.log("Successfully added: answer.employee");
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
                 console.log("Successfully added: " + answer.employee");
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

function viewSomething() {
    inquirer
      .prompt([
       {
        name: "view",
        type: "list",
        message: "What would you like to view?",
        choices: [
            "Employees",
            "Roles",
            "Departments"
        ]
       }
      ])
      .then(function(answer) {
        switch (answer.view) {
        case "Employees":
            viewEmployee();
            break;
        
        case "Roles":
            viewRole();
            break;

        case "Departments":
            viewDepartment();
            break;
        }
      });
}

function viewRole() {
  
    connection.query("SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY department.name", function(err, results) {
      var table = new Table({
        head: ['Title', 'Salary', 'Department']
        , colWidths: [25, 10, 20]
        });
      for (var i = 0; i < results.length; i++) {
        var title = results[i].title;
        var salary = results[i].salary;
        var department = results[i].name;
        table.push(
          [title, salary, department]
          
        );
      }
      console.log(table.toString());
      console.log(" ");
      start();
    });
      
}

function viewDepartment() {
    console.log("Here are all current departments");
    console.log(" ");
    var table = new Table({
      head: ['ID', 'Department']
      , colWidths: [10, 20]
      });    
    connection.query("SELECT * FROM department", function(err, results) {
      
      for (var i = 0; i < results.length; i++) {
        var department = results[i].name;
        var id = results[i].id;
        
        table.push(
          [id, department]
          
        );
      }
      console.log(table.toString());
      console.log(" ");
      start();
    })
  
}

function sortByDepartment() {
  connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS Employee, IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'No Manager') AS Manager, role.title, role.salary, department.name FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id  ORDER BY department.name, e.last_name", function(err, results) {
    var table = new Table({
      head: ['Employee', 'Title', 'Salary', 'Department', 'Manager']
      , colWidths: [20, 25, 10, 20, 20]
      });
    for (var i = 0; i < results.length; i++) {
      var employee = results[i].Employee;
      var manager = results[i].Manager;
      var employeeTitle = results[i].title;
      var employeeSalary = results[i].salary;
      var employeeDept = results[i].name;
     


      table.push(
        [employee, employeeTitle, employeeSalary, employeeDept, manager]
        
      );
     
    }
    console.log(table.toString());
    console.log(" ");
    askUser();
  });  
       
}

function sortByManager() {
    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS Employee, IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'No Manager') AS Manager, role.title, role.salary, department.name FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id  ORDER BY Manager, department.name", function(err, results) {
      var table = new Table({
        head: ['Employee', 'Title', 'Salary', 'Department', 'Manager']
        , colWidths: [20, 25, 10, 20, 20]
        });
      for (var i = 0; i < results.length; i++) {
        var employee = results[i].Employee;
        var manager = results[i].Manager;
        var employeeTitle = results[i].title;
        var employeeSalary = results[i].salary;
        var employeeDept = results[i].name;
       
  
  
        table.push(
          [employee, employeeTitle, employeeSalary, employeeDept, manager]
          
        );
       
      }
      console.log(table.toString());
      console.log(" ");
      askUser();
    });  
  
}

function updateSomething() {
    inquirer
      .prompt([
        {
          name: "updateWhat",
          type: "list",
          message: "What would you like to update?",
          choices: [
            "Update current employee's role",
            "Update current employee's manager"
          ]
        }
      ])
      .then(function(answer) {
        switch (answer.updateWhat) {
        case "Update current employee's role":
            updateRole();
            break;
        
        case "Update current employee's manager":
            updateManager();
            break;
  
        }
    });
}

function updateRole() {
    connection.query("SELECT * FROM role", function(err, results) {
     connection.query("SELECT * FROM employee", function(err, res) {
      inquirer
        .prompt([
         {
          name: "employee",
          type: "list",
          message: "Who's role is changing?",
          choices: function() {
            var choicesArray = [];
            for (var i = 0; i < res.length; i++) {
                choicesArray.push(res[i].first_name + " " + res[i].last_name);
            }
            return choicesArray;
          }
        },
  
        {
          name: "newRole",
          type: "list",
          message: "What is their new role?",
          choices: function() {
            var roleArray = [];
            for (var i = 0; i < results.length; i++) {
              roleArray.push(results[i].title);
            }
            return roleArray;
          }
        }    
      ])
      .then(function(answer) {
        var newRole = answer.newRole;
        var str = answer.employee;
        employeeName = str.split(" ");
        var first = employeeName[0];
        var last = employeeName[1];
        connection.query("SELECT id FROM role WHERE ?", { title: newRole }, function(err, res) {
          var newRoleId = res[0].id;
          connection.query("UPDATE employee SET ? WHERE ?",
          [
            {
              role_id: newRoleId
            },
            {
              last_name: last
            }
          ],        
          function(err, res) {
            if (err) throw err;
            console.log("Successfully updated role");
            start();
          }
          )
        });
      });
    }) 
   })
  }
  
  function updateManager() {
    connection.query("SELECT * FROM employee", function (err, res) {
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Who is changing managers?",
            choices: function() {
              var employeeArray = [];
              for (var i = 0; i < res.length; i++) {
                employeeArray.push((res[i].first_name + " " + res[i].last_name));
              }
              return employeeArray;
            }
          },
          {
            name: "newManager",
            type: "list",
            message: "Who is their new manager?",
            choices: function() {
              var managerArray = [];
              for (var i = 0; i < res.length; i++) {
                managerArray.push((res[i].first_name + " " + res[i].last_name));
              }
              return managerArray;
            } 
  
          }
      
        ])
        .then(function(answer) {
          var str = answer.employee;
          employeeName = str.split(" ");
          var first = employeeName[0];
          var last = employeeName[1];
          var manstr = answer.newManager;
          managerName = manstr.split(" ");
          var manFirst = managerName[0];
          var manLast = managerName[1];
          connection.query("SELECT id FROM employee WHERE ?", {last_name: manLast}, function(err, result){
            var newManId = result[0].id;
            connection.query("UPDATE employee SET ? WHERE ?",
            [
              {
                manager_id: newManId
              },
              {
                last_name: last
              }
            ],        
            function(err, res) {
              if (err) throw err;
              console.log("Succcessfully updated manager");
              start();
            }
            )
  
          })
          
        })
    })
  
}

function deleteEmployee() {
    connection.query("SELECT * FROM employee", function(err, res) {
      inquirer
      .prompt([
        {
          name: "deleteWho",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: function() {
            var employeeArray = [];
            for (var i = 0; i < res.length; i++) {
              employeeArray.push((res[i].first_name + " " + res[i].last_name));
            }
            return employeeArray;
          }
        }
      ])
      .then(function(answer) {
        var str = answer.deleteWho;
        employeeName = str.split(" ");
        var first = employeeName[0];
        var last = employeeName[1];
        connection.query("DELETE FROM employee WHERE ?",
          {
            last_name: last
          },
          function(err, res) {
            if (err) throw err;
            console.log("Employee removed!");
            start();
          }
        );
      });
    });
   
  }