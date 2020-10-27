const mysql = require("mysql");
const {mainMenu} = require("./functions.js");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Yourpassword",
    database: "cmsDB"
});
//This is the initialization function
function start(){
    const view = mainMenu(connection);
}

connection.connect(async () => {
//Here we call the initialization function
    start();
});


