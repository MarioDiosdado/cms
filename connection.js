const mysql = require("mysql");
const {mainMenu} = require("./functions.js");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Laparrilla82",
    database: "cmsDB"
});

function start(){
    const view = mainMenu(connection);
}

connection.connect(async () => {
    start();
});


