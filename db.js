var mysql = require('mysql');
const { connect } = require('./routes');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: null,
    database: "konkursas",
    multipleStatements: true
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database");
  });