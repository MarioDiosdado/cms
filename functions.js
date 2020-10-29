const inquirer = require("inquirer");

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
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        let roleFull = res.map(test2 => test2);
        let roleTitle = res.map(test1 => test1.title);
        getManager(connection, roleTitle, roleFull);
    })
}

function getManager(connection, roleTitle, roleFull) {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", (err, res) => {
        if (err) throw err;
        let employeeName = res.map(employee => employee.name);
        let managerFull = res.map(employee => employee);
        addEmployee(connection, roleTitle, roleFull, employeeName, managerFull);
    })
}

function addEmployee(connection, roleTitle, roleFull, employeeName, managerFull) {

    inquirer.prompt([
        { type: "input", name: "firstName", message: "What's the employee first name?" },
        { type: "input", name: "lastName", message: "What's the employee last name?" },
        { type: "list", name: "roleID", message: "What's the employee's role?", choices: roleTitle },
        { type: "list", name: "managerID", message: "Select your manager", choices: employeeName }
    ])
        .then(function (data) {
            let insertRole;
            let managerID;
            roleFull.forEach(role => {
                if (role.title === data.roleID) {
                    insertRole = role.id;
                }
            })
            managerFull.forEach(manager => {
                if (manager.name === data.managerID) {
                    managerID = manager.id;
                }
            })
            connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);", [data.firstName, data.lastName, insertRole, managerID], (err, res) => {
                if (err) throw err;
                console.log("Success!")
                mainMenu(connection);
                connection.end;
            })
        })
}

function addDepartment(connection) {
    inquirer.prompt([
        { type: "input", name: "department", message: "What's the name of the department you want to add?" }
    ]).then(function (data) {
        var department = data.department
        connection.query("INSERT INTO department (name) VALUES (?)", department, (err, res) => {
            if (err) throw err;
            console.log("Success!")
            mainMenu(connection);
        })
    })
}

function getDepartment(connection) {
    arrDepartment = [];
    connection.query("SELECT name FROM department;", (err, res) => {
        if (err) throw err;
        const arrDepartment = res.map(a => a.name);
        checkDepartment(connection, arrDepartment);
    })

}

function checkDepartment(connection, arrDepartment) {
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
    connection.query("SELECT title FROM role", (err, res) => {
        if (err) throw err;
        const arrRole = res.map(a => a.title);
        checkRole(connection, arrRole);
    })
}
function checkRole(connection, arrRole) {
    inquirer.prompt([
        { type: "list", name: "roles", message: "Select role", choices: arrRole }
    ]).then(function (data) {
        const role = data.roles;
        connection.query("SELECT first_name, last_name, title FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.title = ?", role, (err, res) => {
            if (err) throw err;
            console.table(res);
            mainMenu(connection);
        })
    })
}

function addRole(connection, arrDeptName, arrDeptId) {
    inquirer.prompt([
        { type: "input", name: "title", message: "What's the name of the role you want to add" },
        { type: "input", name: "salary", message: "What's the salary of the role you want to add" },
        { type: "list", name: "department", message: "What's the department of the role you want to add", choices: arrDeptName }
    ]).then(function (data) {
        const department = data.department;
        let deptId;
        arrDeptId.forEach(a => {
            if (a.name === department) {
                deptId = a.id;
            }
        });
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [data.title, data.salary, deptId], (err, res) => {
            if (err) throw err;
            console.log("Success!")
            mainMenu(connection);
        })
    })
}

function arrayGen(connection) {
    connection.query("SELECT id, name FROM department;", (err, res) => {
        if (err) throw err;
        const arrDeptName = res.map(a => a.name);
        const arrDeptId = res.map(a => a);
        addRole(connection, arrDeptName, arrDeptId);
    });
}

function updateRole(connection, employeeId, employeeFull, roleId, roleFull) {
    inquirer.prompt([
        { type: "list", name: "name", message: "Select the employee you want to update", choices: employeeId },
        { type: "list", name: "role", message: "Select the new role", choices: roleId }
    ])
        .then(function (data) {
            const name = data.name;
            const role = data.role;
            let employ;
            let roleF;
            employeeFull.forEach(a => {
                if (a.name === name) {
                    employ = a.id;
                }
            });
            roleFull.forEach(a => {
                if (a.title === role) {
                    roleF = a.id;
                }
            });
            connection.query("UPDATE employee SET role_id = ? WHERE employee.id = ?", [roleF, employ], function (err, res) {
                if (err) throw err;
                console.log("Success!")
                mainMenu(connection);
            })
        })
};
function getEmployeeId(connection) {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", (err, res) => {
        if (err) throw err;
        const employeeId = res.map(a => a.name);
        const employeeFull = res.map(a => a);
         getRoleId(connection, employeeId, employeeFull);
    })
}

function getRoleId(connection, employeeId, employeeFull) {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        const roleId = res.map(a => a.title);
        const roleFull = res.map(a => a);
        updateRole(connection, employeeId, employeeFull, roleId, roleFull);
    })
}

module.exports = {
    mainMenu,
};