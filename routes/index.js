
/*
 * GET home page.
 */

var fs = require('fs');

// load config for trello api key
var conf = JSON.parse(fs.readFileSync(__dirname + "/../conf/trello.conf"));

exports.index = function(req, res){
  res.render('index', { title: 'Trebot' , "conf": conf});
};
