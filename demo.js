var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "db_project"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM hospital_ownership", function (err, result, fields) {
    if (err) throw err;
    console.log(JSON.stringify(result));
  });
});