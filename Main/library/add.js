const express = require("express");
const inquirer = require("inquirer");
const util = require("util");
const sql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const connection = sql.createConnection({
  host: "localhost",
  user: "Precious",
  password: "LuvBug321$",
  database: "hr_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected.");
});
connection.query = util.promisify(connection.query);


addEntry = () => {
    inquirer.prompt([
        {
            name: "add",
            type: "list",
            message: "What would you like to add?",
            choices: [
                "Sector",
                "Worker",
                "Role",
                "main menu"
            ]
        }
    ]).then(answer => {
        if (answer.add === "Sector"){
            addSector();
        }else if (answer.add === "Worker"){
            addWorker();
        }else if (answer.add === "Role"){
            addRole();
        }else if (answer.add === "main menu"){
            initiate();
        }else {
            exit();
        }
    })
  }
  
  
  addWorker = () => {
    readRoles().then(Roles => {
        const RoleChoices = Roles.map(({title: name, id: value}) => ({name, value}));
        inquirer.prompt([
            {
                name: "empManager",
                type: "input",
                message: "Who is the Worker's manager? (Enter N/A if no manager)",
                validate: (value) => {
                    if (value.length > 0) {
                        return true;
                    } else {
                        return "Enter a valid manager.";
                    }
                }
            },
            {
                name: "empRole",
                type: "list",
                message: "What is the Worker's Role?",
                choices: RoleChoices
            },
            {
                name: "firstName",
                type: "input",
                message: "What is the Worker's first name?",
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
                message: "What is the Worker's last name?",
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
                "INSERT INTO Worker SET ? ", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    manager_name: answer.empManager,
                    Role_id: answer.empRole
                }, (err => {
                    if (err) throw err;
                    console.log("\n");
                    console.log(`${answer.firstName} ${answer.lastName} has been added to the Worker table.`);
                    console.log("\n");
                    initiate();
                }))
        })
    })
  }
  addRole = () => {
    readSectors().then(Sectors => {
        const SectorChoices = Sectors.map(({name: name, id: value}) => ({name, value}));
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Role title?",
                validate: (value) => {
                    if (value.length > 0) {
                        return true;
                    } else {
                        return "Enter valid title.";
                    }
                }
            },
            {
                name: "salary",
                type: "input",
                message: "Role salary?",
                validate: (value) => {
                    if (value.length > 0) {
                        return true;
                    } else {
                        return "Enter valid salary.";
                    }
                }
            },
            {
                name: "Sector",
                type: "list",
                message: "Role Sector?",
                choices: SectorChoices
            }
        ]).then(answer => {
            connection.query(
                "INSERT INTO Role SET ? ", {
                    title: answer.title,
                    salary: answer.salary,
                    Sector_id: answer.Sector
                }, (err => {
                    if (err) throw err;
                    console.log("\n");
                    console.log(`${answer.title} has been added to the Role table.`);
                    console.log("\n");
                    initiate();
                }))
        })
    })
  }
  
  addSector = () => {
    inquirer.prompt([
        {
            name: "Sector",
            type: "input",
            message: "Sector?",
            validate: (value) => {
                if (value.length > 0) {
                    return true;
                } else {
                    return "Enter valid Sector name.";
                }
            }
        }
    ]).then(answer => {
      console.log(answer);
        sequelize.query(
            "INSERT INTO Sector SET ? ", {
                Sector_name: answer.Sector
            }, (err => {
                if (err) throw err;
                console.log("\n");
                console.log(`${answer.Sector} has been added to the Sector table.`);
                console.log("\n");
                initiate();
            }))
    })  
  }



  readSectors = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Sector", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  } 

  readRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Role", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  }
  
  readWorkers = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Worker", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  }
  
 
module.exports = {addEntry};