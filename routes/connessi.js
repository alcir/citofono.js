var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    if (req.session.admin === true) {
        next();
    } else {
        res.render('index', {
            title: 'Citofono',
            auth: '0'
        });
    }

  }, function(req, res) {

    var clienti = [];

    res.sockets.forEach(function(client, index, array) {
        clienti.push(client.name);
    });

    res.tlssockets.forEach(function(client, index, array) {
        clienti.push(client.name);
    });

    res.render('connessi', { title: 'Connessioni', clienti: clienti });

});

module.exports = router;
