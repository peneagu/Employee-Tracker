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

updateEntry = () => {
    inquirer.prompt([
        {
            name: "update",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Delete department",
                "Delete employee",
                "Delete Position",
                "Update employee Position",
                "main menu"
            ]
        }
    ]).then(answer => {
        if (answer.update === "Delete department"){
            deleteDepartment();
        }else if (answer.update === "Delete employee"){
            deleteEmployee();
        }else if (answer.update === "Delete Position"){
            deletePosition();
        }else if (answer.update === "Update employee Position"){
            updateEmployeePosition();
        }else if (answer.update === "main menu"){
            initiate();
        }else {
            exit();
        }
    })
  }
  
  deleteEmployee = () => {
    readEmployees().then(employees => {
        const deleteEmp = employees.map(({first_name: name, id: value}) => ({name, value}));
        inquirer.prompt([
            {
                name: "delEmployee",
                type: "list",
                message: "Which employee would you like to delete?",
                choices: deleteEmp
            }
        ]).then(answer => {
            connection.query(
                "DELETE FROM employee WHERE id = ?", [answer.delEmployee],
                    async function (err, res) {
                        try {
                            if (err) throw err;
                            console.log("\n");
                            console.log("Employee deleted");
                            console.log("\n");
                            await initiate();
                        } catch (err) {
                            console.log(err);
                        }
                    });
        })
  
    })
  }

  deleteDepartment = () => {
    readDepartments().then(departments => {
        const deleteDep = department.map(({name: name, id: value}) => ({name, value}));
        inquirer.prompt([
            {
                name: "delDepartment",
                type: "list",
                message: "Which department would you like to delete?",
                choices: deleteDep
            }
        ]).then(answer => {
            connection.query(
                "DELETE FROM department WHERE id = ?", [answer.delDepartment],
                    async function (err, res) {
                        try {
                            if (err) throw err;
                            console.log("\n");
                            console.log("Department deleted");
                            console.log("\n");
                            await initiate();
                        } catch (err) {
                            console.log(err);
                        }
                    });
        })
  
    })
  }
  
  
  deletePosition = () => {
    readPositions().then(Positions => {
        const deletePosition = Positions.map(({title: name, id: value}) => ({name, value}));
        inquirer.prompt([
            {
                name: "delPosition",
                type: "list",
                message: "Which Position would you like to delete?",
                choices: deletePosition
            }
        ]).then(answer => {
            connection.query(
                "DELETE FROM Position WHERE id = ?", [answer.delPosition],
                    async function (err, res) {
                        try {
                            if (err) throw err;
                            console.log("\n");
                            console.log("Position deleted");
                            console.log("\n");
                            await initiate();
                        } catch (err) {
                            console.log(err);
                        }
                    });
        })
  
    })
  }
  
  async function updateEmployeePosition(){
    try{
        const Positions = await readPositions();
        const employees = await readEmployees();
        const employeeChoices = employees.map(({first_name: name, id: value}) => ({name, value}));
        const PositionChoices = Positions.map(({title: name, id: value}) => ({name, value}));
        inquirer.prompt([
            {
                name: "Position",
                type: "list",
                message: "What is the new Position?",
                choices: PositionChoices
            },
            {
                name: "employee",
                type: "list",
                message: "Which employee would you like to update?",
                choices: employeeChoices
            }
          
        ]).then(answer => {
            connection.query(
                "UPDATE employee SET Position_id = ? WHERE id = ?", [answer.Position, answer.employee],
                    async function (err, res) {
                        try {
                            if (err) throw err;
                            console.log("\n");
                            console.log("Employee Position updated");
                            console.log("\n");
                            await initiate();
                        } catch (err) {
                            console.log(err);
                        }
                    });
        })
    }
    catch(err){
        console.log(err);
    }
  }

  readEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employee", function (err, res) {
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
  
  readDepartments = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  } 

  module.exports = {updateEntry}