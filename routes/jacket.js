var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Jacket', { title: 'Search Results Jacket' });
});

module.exports = router;