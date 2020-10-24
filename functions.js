const inquirer = require("inquirer");

function mainMenu(connection) {
    inquirer.prompt([
        {
            type: "list", name: "menu", message: "What would you like to do",
            choices: ["View all employees", "View all employees by department", "View employees by role", "Add employee", "Add role", "Add department", "Update employee role"]
        }
    ]).then(function(data){
        if(data.menu === "View all employees"){
            viewEmployees(connection);
        } else if(data.menu === "Add employee") {
            addEmployee(connection);
        }
    })
}

function viewEmployees(connection) {
    connection.query("SELECT a.first_name, a.last_name, title, name as Department, salary, CONCAT(b.first_name, ' ', b.last_name) AS Manager  FROM employee a INNER JOIN role ON a.role_id = role.id INNER JOIN department ON role.department_id = department.id INNER JOIN employee b ON b.id = a.manager_id ORDER BY a.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end;
    })
}
var b = [];
var c = [];
var d;
function addEmployee(connection) {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function (err, res) {
        if (err) throw err;
        
        for (i = 0; i < res.length; i++){
            b.push(res[i].name);
            c.push(res[i]);
        }
    })
    inquirer.prompt([
        { type: "input", name: "firstName", message: "What's the employee first name?" },
        { type: "input", name: "lastName", message: "What's the employee last name?" },
        { type: "input", name: "roleID", message: "What's the employee's role?" },
        { type: "list", name: "managerID", message: "Manager ID", choices: b }
     ])
     .then(function (data) {
         const manager = data.managerID;
         for( i = 0; i < c.length; i++){
             if( c[i].name === manager) {
                d = c[i].id;
             }
         }
         console.log(d);
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);", [data.firstName, data.lastName, data.roleID, d], function (err, res) {
            if (err) {
                throw err;
            } else {
                console.log("Success!")
                mainMenu(connection);
            }
            connection.end;
        })
    })
}

module.exports = {
    mainMenu,
    viewEmployees,
    addEmployee
};