var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("index");
  if (req.session.admin === true) {
    res.render('index', { title: 'LCitofono', auth: '1' });
  } else {
    res.render('index', { title: 'Citofono', auth: '0' });
  }
});

router.post('/login', function(req, res, next) {
  if (req.body.username === "apri" && req.body.password === "cancello") {
    console.log("Auth ok");
    req.session.user = req.body.username;
    req.session.admin = true;
    console.log("Auth ok " + req.session.user + " " + req.session.admin + " - " + req.body.username);
    res.render('index', { title: 'LCitofono', auth: '1' });
  } else {
    console.log("Auth non ok");
    res.render('index', { title: 'Citofono', auth: '0' });
  }
});

// Logout endpoint
router.get('/logout', function (req, res) {
  req.session.destroy();
  console.log("logout success!");
  res.render('index', { title: 'Citofono', auth: '0' });
});

module.exports = router;
