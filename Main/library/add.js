const express = require("express");
const inquirer = require("inquirer");
const sql = require("mysql2");
const util = require("util");



const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = sql.createConnection({
  host: "localhost",
  user: "Precious",
  password: "LuvBug321$",
  database: "hr_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

 
});

connection.query = util.promisify(connection.query);


addEntry = () => {
    inquirer.prompt([
        {
            name: "add",
            type: "list",
            message: "What would you like to add?",
            choices: [
                "department",
                "employee",
                "Position",
                "main menu"
            ]
        }
    ]).then(answer => {
        if (answer.add === "department"){
            addDepartment();
        }else if (answer.add === "employee"){
            addEmployee();
        }else if (answer.add === "Position"){
            addPosition();
        }else if (answer.add === "main menu"){
            initiate();
        }else {
            exit();
        }
    })
  }
  
  
  addEmployee = () => {
    readPositions().then(Positions => {
        const PositionChoices = Positions.map(({title: name, id: value}) => ({name, value}));
        inquirer.prompt([
            {
                name: "empManager",
                type: "input",
                message: "Who is the employee's manager? (Enter N/A if no manager)",
                validate: (value) => {
                    if (value.length > 0) {
                        return true;
                    } else {
                        return "Enter a valid manager.";
                    }
                }
            },
            {
                name: "empPosition",
                type: "list",
                message: "What is the employee's Position?",
                choices: PositionChoices
            },
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?",
                validate: (value) => {
                    if (value.length > 0) {
                        return true;
                    } else {
                        return "Enter a valid first name.";
                    }
                }
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?",
                validate: (value) => {
                    if (value.length > 0) {
                        return true;
                    } else {
                        return "Enter a valid last name.";
                    }
                }
            }
           
        ]).then(answer => {
            connection.query(
                "INSERT INTO employee SET ? ", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    manager_name: answer.empManager,
                    Position_id: answer.empPosition
                }, (err => {
                    if (err) throw err;
                    console.log("\n");
                    console.log(`${answer.firstName} ${answer.lastName} has been added to the employee table.`);
                    console.log("\n");
                    initiate();
                }))
        })
    })
  }
  
  addDepartment = () => {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What is the name of the department?",
            validate: (value) => {
                if (value.length > 0) {
                    return true;
                } else {
                    return "Enter a valid department name.";
                }
            }
        }
    ]).then(answer => {
      console.log(answer);
        sequelize.query(
            "INSERT INTO department SET ? ", {
                department_name: answer.department
            }, (err => {
                if (err) throw err;
                console.log("\n");
                console.log(`${answer.department} has been added to the department table.`);
                console.log("\n");
                initiate();
            }))
    })  
  }

  addPosition = () => {
    readDepartments().then(departments => {
        const departmentChoices = departments.map(({name: name, id: value}) => ({name, value}));
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the Position's title?",
                validate: (value) => {
                    if (value.length > 0) {
                        return true;
                    } else {
                        return "Enter a valid title.";
                    }
                }
            },
            {
                name: "salary",
                type: "input",
                message: "What is the Position's salary?",
                validate: (value) => {
                    if (value.length > 0) {
                        return true;
                    } else {
                        return "Enter a valid salary.";
                    }
                }
            },
            {
                name: "department",
                type: "list",
                message: "What is the Position's department?",
                choices: departmentChoices
            }
        ]).then(answer => {
            connection.query(
                "INSERT INTO Position SET ? ", {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department
                }, (err => {
                    if (err) throw err;
                    console.log("\n");
                    console.log(`${answer.title} has been added to the Position table.`);
                    console.log("\n");
                    initiate();
                }))
        })
    })
  }

  readDepartments = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  } 

  readPositions = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Position", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  }
  
  readEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employee", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  }
  
 
module.exports = {addEntry};