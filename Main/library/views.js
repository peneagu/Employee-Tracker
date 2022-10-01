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

viewEntry = () => {
    inquirer.prompt([
      {
        name: "view",
        type: "list",
        message: "What would you like to view?",
        choices: [
          "View department",
          "View positions",
          "View employees",
          "View employees by department",
          "View employees by position",
          "View employees by manager",
          "Return to main menu"
        ]
      }
      ]).then(answer => {
        if (answer.view === "View department"){
          viewDepartments();
        }else if (answer.view === "View employees by manager"){
            viewEmployeesByManager();
        }else if (answer.view === "View positions"){
          viewPositions();
        }else if (answer.view === "View employees"){
          viewEmployees();
        }else if (answer.view === "View employees by position"){
            viewEmployeesByPosition();
        }else if (answer.view === "View employees by department"){
          viewEmployeesByDepartment();
        }else if (answer.view === "Return to main menu"){
          initiate();
        }else {
          exit();
        }
      })
    }
  
viewDepartments = () => {
    connection.query("SELECT * FROM department", async function (err, res) {
      try {
        if (err) throw err;
        console.log("\n");
 

        console.table("department", res);
        console.log("\n");
        await initiate();
      } catch (err) {
        console.log(err);
      }
    })
  }
  
viewpositions = () => {
    connection.query("SELECT * FROM position", async function (err, res) {
      try {
        if (err) throw err;
        console.log("\n");
        console.table("position", res);
        console.log("\n");
        await initiate();
      } catch (err) {
        console.log(err);
      }
    })
  }
  
viewEmployees = () => {
    connection.query("SELECT * FROM employee", async function (err, res) {
      try {
        if (err) throw err;
        console.log("\n");
        console.table("employee", res);
        console.log("\n");
        await initiate();
      } catch (err) {
        console.log(err);
      }
    })
  }
  
viewEmployeesByDepartment = () => {
    readDepartments().then(departments => {
      const employeeDept = departments.map(({ name: name, id: value}) => ({ name, value }));
      inquirer.prompt([
        {
          name: "department",
          type: "list",
          message: "Which department would you like to view?",
          choices: employeeDept
        }
      ]).then(answer => {
        let query = "SELECT * FROM employee WHERE position_id = ?";
        connection.query(query, [answer.department], async function (err, res) {
          if (err) throw err;
            try {
              console.log("\n");
              console.table("positions", res);
              console.log("\n");
              await initiate();
            }
            catch (err) {
              console.log(err);
            }
        }
        )})
        .catch(err => {
          console.log(err);
        })
    })};
  
viewEmployeesByposition = () => {
    readpositions().then(positions => {
      const employeeposition = positions.map(({ name: name, id: value}) => ({ name, value }));
      inquirer.prompt([
        {
          name: "position",
          type: "list",
          message: "Which position would you like to view?",
          choices: employeeposition
        }
      ]).then(answer => {
        let query = "SELECT * FROM employee WHERE position_id = ?";
        connection.query(query, [answer.position], async function (err, res) {
          if (err) throw err;
            try {
              console.log("\n");
              console.table("positions", res);
              console.log("\n");
              await initiate();
            }
            catch (err) {
              console.log(err);
            }
        }
        )})
        .catch(err => {
          console.log(err);
        })
    })
  }
  
viewEmployeesByManager = () => {
    connection.query("SELECT manager_name AS Manager, CONCAT(first_name, ' ', last_name) AS Employee FROM employee", async function (err, res) {
      try {
        if (err) throw err;
        console.log("\n");
        console.table("employee", res);
        console.log("\n");
        await initiate();
      } catch (err) {
        console.log(err);
      }
    })
  }
  
readpositions = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM position", function (err, res) {
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
  
readDepartments = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  }

  module.exports = {viewEntry};