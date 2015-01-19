
/*
 * GET home page.
 */

var fs = require('fs');

// load config for trello api key
var conf = JSON.parse(fs.readFileSync("./conf/trello.conf"));

exports.index = function(req, res){
  res.render('index', { title: 'Express' , "conf": conf});
};
