const express = require("express");
const inquirer = require("inquirer");
const clear = require("clear");
const sql = require("mysql2");
const util = require("util");

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const connection = sql.createConnection({
    host: "localhost",
    user: "Precious",
    password: "TechGirl343!",
    database: "hr_db"
});

function firstPromt() { 
    inquirer.prompt({
        type: 'checkbox',
        name: 'choice',
        message: 'What would you like to do',
        choices: ['View Divisions', 'View Positions','View Workers','Add a Division','Add a Position', 'Add Worker', 'Update Worker']
        }).then((answers) => {
        if (answers.choice === 'View Divisions') {
            viewDivision();
        } else if (answers.choice === 'Add Worker') {
            console.log('Add Worker');
            AddWorker();
            
        } else if (answers.choice === 'View Positions') {
            viewPositions();

        } else if (answers.choice === 'Add a Division') {
            console.log('Add a Division');
            AddDivision();
        } else if (answers.choice === 'View Workers') {
            console.log('View Workers');
            viewWorkers();
        
        } else if (answers.choice === 'Add a Position') {
            console.log('Add a Position');
            AddPosition();
        
        } else if (answers.choice === 'Update Worker') {
            console.log('Update Worker')
            updateWorker();
        }
    });
}
firstPromt();

function viewDivision(){
    connection.query(
        'SELECT * FROM Division',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.table(results);
            After();
        }
    );
}

function viewWorkers(){
    connection.query(
        'SELECT * FROM Worker',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.table(results);
            After();

        }
    );
}

function viewPositions(){
    connection.query(
        'SELECT * FROM Position',  
        function(err, results) {
            if (err){
                throw err;
            }
            console.table(results);
            After();
        }
    );
}


function AddPosition(){

    connection.query(
        'SELECT name, id FROM Division',
        function(err, Division){
            if (err){
                throw err;
            }
            let DivisionList = Division.map((DivisionInfo) => {
                return{
                    name: DivisionInfo.name,
                    value: DivisionInfo.id
                }
            })
    inquirer
    .prompt([
    {
        type: 'input',
        name: 'title',
        message: 'What is the title for this Position',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this Position'
    },
    {
        type: 'list',
        name: 'Division',
        message: 'Which Division will this Position be in',
        choices: DivisionList
    }
    ])
    .then((answers) => {
    console.log(answers);
        connection.query('INSERT INTO Position SET ', {
            title: answers.title,
            salary: answers.salary, 
            Division_id: parseInt(answers.Division),
        },
        function(err, results) {
            if (err){
                throw err;}
            console.table('Position HAS BEEN ADDED!');
            firstPromt();

        }
    );
    })
})
}

function AddDivision(){
    inquirer
    .prompt([
    {
        type: 'input',
        name: 'name',
        message: 'What is the Division name',
    },
    ])
    .then((answers) => {
    console.log(answers);
        connection.query('INSERT INTO Division SET ', {name: answers.name},
        function(err, results) {
            if (err){
                throw err;
            }
            console.table(results);
            After();

        }
    );
    });
}

function updateWorker(){
    connection.query(
        'SELECT id, first_name, last_name FROM Worker',
        function(err, results) {
            if (err){
                throw err;
            }
            let WorkerList = results.map((WorkerInfo)=>{
                return {
                    name: WorkerInfo.first_name,
                    value: WorkerInfo.id
                }
            })
            console.log(WorkerList)

            connection.query(
                'SELECT id, title FROM Position',
                function(err, Position) {
                    if (err){
                        throw err;
                    }
            let PositionList = Position.map((PositionInfo) => {
                return {
                    name: PositionInfo.title,
                    value: PositionInfo.id
                }
            })

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'who',
                    message: 'update worker info',
                    choices: WorkerList
                },
                {
                    type: 'list',
                    name: 'Position',
                    message: 'update position info',
                    choices: PositionList
                }
            ]).then((answers) => {
                console.log(answers);
                connection.query( 
                    `UPDATE Worker SET Position_id = ${answers.Position} WHERE id = ${answers.who}`,
                    function(err, results) {
                        if (err){
                            throw err;}
                        console.table('Successful update');
                        After();
                    }
                    )
            })
        });
    }
    )};

function AddWorker(){
    inquirer
    .prompt([
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the Workers first name',
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the Workers last name',
    },
    {
        type: 'input',
        name: 'Position_id',
        message: 'What is the Position id',
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'What is the Worker\'s managers id',
    },
    ])
    .then((answers) => {
    console.log(answers);
        connection.query('INSERT INTO Worker SET ', {
            first_name: answers.first_name,
            last_name: answers.last_name, 
            Position_id: answers.Position_id,
            manager_id: answers.manager_id
        },
        function(err, results) {
            if (err){
                throw err;}
            console.table(results);
            firstPromt();

        }
    );
    })
}

function After() {
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Continue?',
        choices: ['No', 'Yes']
        
    }).then((answers) => {
        if (answers.choice === 'No') {
            
            console.log('Successfully Tracked');
            return
        } else if (answers.choice === 'Yes') {
            firstPromt();
        }
    });
}