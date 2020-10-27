const inquirer = require("inquirer");
//Variables
const arrRoleB = [];
const arrRoleBFull = [];
let arrRoleF;
let employeName = [];
const managerFull = [];
let manageID;
let arrDepartment = [];
let arrRole = [];
const arrDeptName = [];
const arrDeptId = [];
let deptId;
const employeeId = [];
const employeeFull = [];
const roleId = [];
const roleFull = []
let employ;
let roleF;

function mainMenu(connection) {
    inquirer.prompt([
        {
            type: "list", name: "menu", message: "What would you like to do",
            choices: ["View all employees", "View all employees by department", "View employees by role", "Add employee", "Add role", "Add department", "Update employee role"]
        }
    //Main menu choices and their functions
    ]).then(function (data) {
        if (data.menu === "View all employees") {
            viewEmployees(connection);
        } else if (data.menu === "Add employee") {
            getRoleB(connection);
        } else if (data.menu === "Add department") {
            addDepartment(connection);
        } else if (data.menu === "View all employees by department") {
            getDepartment(connection);
        } else if (data.menu === "View employees by role") {
            getRole(connection);
        } else if (data.menu === "Add role") {
            arrayGen(connection);
        } else if (data.menu === "Update employee role") {
            getEmployeeId(connection);
        } 
    })
}

function viewEmployees(connection) {
    connection.query("SELECT a.first_name, a.last_name, title, name as Department, salary, CONCAT(b.first_name, ' ', b.last_name) AS Manager  FROM employee a INNER JOIN role ON a.role_id = role.id INNER JOIN department ON role.department_id = department.id INNER JOIN employee b ON b.id = a.manager_id ORDER BY a.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu(connection);
    })
}

function getRoleB(connection) {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            arrRoleB.push(res[i].title);
            arrRoleBFull.push(res[i]);
        } getManager(connection);
    })
}

function getManager(connection) {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            employeName.push(res[i].name);
            managerFull.push(res[i]);
        } addEmployee(connection);
    })
}

function addEmployee(connection) {

    inquirer.prompt([
        { type: "input", name: "firstName", message: "What's the employee first name?" },
        { type: "input", name: "lastName", message: "What's the employee last name?" },
        { type: "list", name: "roleID", message: "What's the employee's role?", choices: arrRoleB },
        { type: "list", name: "managerID", message: "Select your manager", choices: employeName }
    ])
        .then(function (data) {
            const manager = data.managerID;
            const roleIdB = data.roleID;

            for (i = 0; i < arrRoleBFull.length; i++) {

                if (arrRoleBFull[i].title === roleIdB) {
                    arrRoleF = arrRoleBFull[i].id;

                }
            }

            for (i = 0; i < managerFull.length; i++) {
                if (managerFull[i].name === manager) {
                    manageID = managerFull[i].id;
                }
            }

            connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);", [data.firstName, data.lastName, arrRoleF, manageID], function (err, res) {
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

function addDepartment(connection) {
    inquirer.prompt([
        { type: "input", name: "department", message: "What's the name of the department you want to add?" }
    ]).then(function (data) {
        var department = data.department
        connection.query("INSERT INTO department (name) VALUES (?)", department, function (err, res) {
            if (err) throw err;
            console.log("Success!")
            mainMenu(connection);
        })
    })
}

function getDepartment(connection) {
    arrDepartment = [];
    connection.query("SELECT name FROM department;", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            arrDepartment.push(res[i].name);
        } checkDepartment(connection);
    })

}

function checkDepartment(connection) {
    inquirer.prompt([
        { type: "list", name: "departments", message: "Select department", choices: arrDepartment }
    ])
        .then(function (data) {
            var department = data.departments;
            connection.query("SELECT first_name, last_name, title, salary, name AS Department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = ?;", department, function (err, res) {
                if (err) throw err;
                console.table(res);
                mainMenu(connection);
            })
        })
}

function getRole(connection) {
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        arrRole = [];
        for (i = 0; i < res.length; i++) {
            arrRole.push(res[i].title);
        } checkRole(connection);
    })
}

function checkRole(connection) {
    inquirer.prompt([
        { type: "list", name: "roles", message: "Select role", choices: arrRole }
    ]).then(function (data) {
        const role = data.roles;
        connection.query("SELECT first_name, last_name, title FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.title = ?", role, function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu(connection);
        })
    })
}

function addRole(connection) {
    inquirer.prompt([
        { type: "input", name: "title", message: "What's the name of the role you want to add" },
        { type: "input", name: "salary", message: "What's the salary of the role you want to add" },
        { type: "list", name: "department", message: "What's the department of the role you want to add", choices: arrDeptName }
    ]).then(function (data) {
        const department = data.department;
        for (i = 0; i < arrDeptId.length; i++) {
            if (arrDeptId[i].name === department) {
                deptId = arrDeptId[i].id;
            }
        }
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [data.title, data.salary, deptId], function (err, res) {
            if (err) throw err;
            console.log("Success!")
            mainMenu(connection);
        })
    })
}

function arrayGen(connection) {
    connection.query("SELECT id, name FROM department;", function (err, res) {
        if (err) {
            throw err;
        } else {
            for (i = 0; i < res.length; i++) {
                arrDeptName.push(res[i].name);
                arrDeptId.push(res[i]);
            } addRole(connection);
        }
    });
}

function updateRole(connection) {
    inquirer.prompt([
        { type: "list", name: "name", message: "Select the employee you want to update", choices: employeeId },
        { type: "list", name: "role", message: "Select the new role", choices: roleId }
    ])
        .then(function (data) {
            const name = data.name;
            const role = data.role;
            for (i = 0; i < employeeFull.length; i++) {
                if (employeeFull[i].name === name) {
                    employ = employeeFull[i].id;
                }
            }
            for (i = 0; i < roleFull.length; i++) {
                if (roleFull[i].title === role) {
                    roleF = roleFull[i].id;
                }
            }
            connection.query("UPDATE employee SET role_id = ? WHERE employee.id = ?", [roleF, employ], function (err, res) {
                if (err) throw err;
                console.log("Success!")
                mainMenu(connection);
            })
        })
};

function getEmployeeId(connection) {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            employeeId.push(res[i].name);
            employeeFull.push(res[i]);
        } getRoleId(connection);
    })
}

function getRoleId(connection) {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            roleId.push(res[i].title);
            roleFull.push(res[i]);
        } updateRole(connection);
    })
}

module.exports = {
    mainMenu,
};