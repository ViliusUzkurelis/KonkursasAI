var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "Konkursas",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

mnodule.exports = con