var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var bodyParser = require('body-parser');
var fs = require('fs');
var jsdom = require("jsdom");
var createHTML = require('create-html');
const {
  JSDOM
} = jsdom;

const {
  document
} = (new JSDOM('')).window;
global.document = document;

app.use("/styles", express.static(__dirname + "/styles"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

router.use(function(req, res, next) {
  console.log("/" + req.method);
  next();
});

router.get("/", function(req, res) {
  res.sendFile(path + "index.html");
});

router.get("/test", function(req, res) {
  res.sendFile(path + "test.html");
});

router.post("/login", function(req, res) {
  console.log(req.body.email);
  console.log(req.body.password);

  var email = req.body.email;
  var pass = req.body.password;

  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM Login WHERE email = '" + email + "' AND password = '" + pass + "';", function(err, result, fields) {
      if (err) {
        throw err
      } else if (!result.length) {
        res.send('Error')
      } else {
        console.log(JSON.stringify(result));
        var html = createHTML({
          title: 'MAP',
          // script: 'google.js',
          scriptAsync: true,
          css: 'example.css',
          lang: 'en',
          dir: 'rtl',
          head: '<meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"> <link rel="stylesheet" href="/styles/login.css"> <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script> <style> .adjust { padding-top: 70px; } </style> <script type="text/javascript">google.charts.load("current", { "packages": ["map"], "mapsApiKey": "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY" }); google.charts.setOnLoadCallback(drawMap);'
          +' function drawMap() { var jsonData = $.ajax({ url: "/test/map", dataType: "json", async: false }).responseText; var json = JSON.parse(jsonData); var data = new google.visualization.DataTable(); data.addColumn("string", "Address"); data.addColumn("string", "Hospital Name"); var l = json.length; for (var i = 0; (l-i)!=0; i++) { row = json[i]; data.addRow([row["address"], row["name"]]); } var options = { mapType: "styledMap", zoomLevel: 7, showTooltip: true, showInfoWindow: true, useMapTypeControl: true, maps: { styledMap: { name: "Styled Map",  styles: [{ featureType: "poi.attraction", stylers: [{ color: "#fce8b2" }] }, { featureType: "road.highway", stylers: [{ hue: "#0277bd" }, { saturation: -50 }] }, { featureType: "road.highway", elementType: "labels.icon", stylers: [{ hue: "#000" }, { saturation: 100 }, { lightness: 50 }] }, { featureType: "landscape", stylers: [{ hue: "#259b24" }, { saturation: 10 }, { lightness: -22 }] } ] } } };'
          + 'var map = new google.visualization.Map(document.getElementById("map_div")); map.draw(data, options); } </script>',
          body: '<nav class="navbar navbar-default navbar-fixed-top"> <div class="container-fluid"> <!-- Brand and toggle get grouped for better mobile display --> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#">Databse Project</a> </div> <!-- Collect the nav links, forms, and other content for toggling --> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav"> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Hospitals<span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="#hospitalOwnership">Ownership</a></li>'
          + '<li><a href="#hospitalType">Type</a></li> <li><a href="#hospitalStarRating">Star Rating</a></li> </ul> </li> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Statistics<span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="#statisticsComplicationAndDeaths">Complications and Deaths</a></li> <li><a href="#statisticsReturnsVsDeaths">Returns vs Deaths</a></li> <li><a href="#statisticsCases">Cases</a></li> </ul> </li> </ul> <!-- <ul class="nav navbar-nav navbar-right"> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown">Login<span class="caret"></span></a> <ul id="login-dp" class="dropdown-menu"> <li> <div class="row"> <div class="col-md-12"> <p align="center">Login</p> <form class="form" role="form" method="post" action="/login" accept-charset="UTF-8" id="login-nav"> <div class="form-group">'
          + '<label class="sr-only" for="email">Email address</label> <input type="email" class="form-control" id="email" name="email" placeholder="Email address" required> </div> <div class="form-group"> <label class="sr-only" for="password">Password</label> <input type="password" class="form-control" id="password" name="password" placeholder="Password" required> </div> <div class="form-group"> <button type="submit" class="btn btn-primary btn-block">Sign in</button> </div> </form> </div> </div> </li> </ul> --> </li> </ul> </div> <!-- /.navbar-collapse --> </div> <!-- /.container-fluid --> </nav> <div class="container-fluid"> <div id="hospitals"> <div class="container-fluid adjust" id="hospitalOwnership"> <h2>Hospitals in Maryland</h2> <div id="map_div" style="width: 75%; height: 500px;"></div> </div> </div> </div>',
          favicon: 'favicon.png'
        });
        res.send(html);
      }
    });
  });
  // res.sendFile(path + "index_old.html");
});

router.get("/hospital/ownership", function(req, res) {

  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT ho.ownership as lab, count(*) as count FROM hospital_ownership ho, hospital h where h.ownership_id = ho.id group by h.ownership_id ", function(err, result, fields) {
      if (err) throw err;
      // console.log(JSON.stringify(result));
      res.send(result);
    });
  });

});

router.get("/hospital/starrating", function(req, res) {

  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query('SELECT h.state as state, AVG(sr.recommend_hospital) as starrating from hospital h, star_rating sr WHERE h.id= sr.hospital_id AND h.state IN ("NC","NY","MD","FL","OH","SC","GA","VA","MA","CT","NH","RI") AND sr.recommend_hospital > 0 GROUP BY h.state;', function(err, result, fields) {
      if (err) throw err;
      // console.log(JSON.stringify(result));
      res.send(result);
    });
  });

});

router.get("/hospital/type", function(req, res) {

  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT COUNT(*) as count, ht.hospital_type as type FROM hospital_type ht, hospital h WHERE h.type_id=ht.id GROUP BY ht.id;", function(err, result, fields) {
      if (err) throw err;
      // console.log(JSON.stringify(result));
      res.send(result);
    });
  });

});

router.get("/statistics/complications_and_deaths", function(req, res) {
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("select CONCAT_WS('-', 'US', h.state) as state, sum(cad.denominator) as number_of_deaths from hospital h, complications_and_deaths cad where h.id = cad.hospital_id and cad.denominator <> 'Not Available' group by h.state", function(err, result, fields) {
      if (err) throw err;
      // console.log(JSON.stringify(result));
      res.send(result);
    });
  });
});

router.get("/statistics/returns_vs_deaths", function(req, res) {
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT AVG(hr.score) hospitalreturns, AVG(cad.score) deaths " +
      "from complications_and_deaths cad, hospital_returns hr, hospital h " +
      "WHERE hr.hospital_id = cad.hospital_id AND hr.score NOT IN ('Not Available') " +
      "AND hr.score > 0 AND cad.score NOT IN ('Not Available') " +
      "AND cad.score > 0 AND hr.hospital_id = h.id GROUP BY h.state having AVG(hr.score) < 18 and AVG(cad.score) < 15;",
      function(err, result, fields) {
        if (err) throw err;
        // console.log(JSON.stringify(result));
        res.send(result);
      });
  });
});

router.get("/statistics/cases", function(req, res) {
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT mc.medical_condition as cases, COUNT(*) AS count " +
      "FROM hospital h, timely_and_effective_care taec, medical_condition mc " +
      "WHERE mc.id= taec.medical_condition AND h.id=taec.hospital_id " +
      "GROUP BY mc.medical_condition;",
      function(err, result, fields) {
        if (err) throw err;
        // console.log(JSON.stringify(result));
        res.send(result);
      });
  });
});

router.get("/data2", function(req, res) {
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("select h.state as state, sum(opv.skin) as skin, sum(opv.eye) as eye, sum(opv.nervous_system) as nervous_system,sum(opv.respiratory) as respiratory from hospital h, outpatient_procedure_volume opv where h.id = opv.hospital_id group by h.state limit 5;", function(err, result, fields) {
      if (err) throw err;
      // console.log(JSON.stringify(result));
      res.send(result);
    });
  });
});

router.get("/data4", function(req, res) {
  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("select h.state as state, stddev(lmv.care_transition) as care_transition," +
      "stddev(lmv.cleanliness) as cleanliness,"
      // + "avg(lmv.communication_about_medicines) as communication_about_medicines,"
      // + "avg(lmv.discharge_information) as discharge_information,"
      // + "avg(lmv.doctor_communication) as doctor_communication,"
      // + "avg(lmv.nurse_communication) as nurse_communication,"
      +
      "stddev(lmv.overall_hospital_rating) as overall_hospital_rating from hospital h," +
      "linear_mean_value lmv where h.id = lmv.hospital_id group by h.state;",
      function(err, result, fields) {
        if (err) throw err;
        // console.log(JSON.stringify(result));
        res.send(result);
      });
  });
});

router.get("/test/map", function(req, res) {

  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_project"
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT CONCAT(address,' , ',city,', ',state) AS address, name  FROM hospital WHERE state='MD';", function(err, result, fields) {
      if (err) throw err;
      console.log(JSON.stringify(result));
      res.send(result);
    });
  });

});

app.use("/", router);

app.use("*", function(req, res) {
  res.sendFile(path + "404.html");
});

app.listen(3000, function() {
  console.log("Live at Port 3000");
});
