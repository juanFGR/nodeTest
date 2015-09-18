
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.page = function(req, res){
  res.render('p', { title: 'pp' })
};