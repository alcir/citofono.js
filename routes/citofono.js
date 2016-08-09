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

    console.log("sockets lenght " + res.sockets.length);
    console.log("tlssockets length " + res.tlssockets.length);

    var notificati = 0;

    if (res.tlssockets.length === 0) {
        console.log("Nessun tls");
    } else {
        // If there are clients remaining then broadcast message
        res.tlssockets.forEach(function(client, index, array) {
            try {
                if (client.writable) {
                    var date = new Date();
                    client.write("agisci " + date + "\r\n");
                    notificati = notificati + 1;
                    console.log("tls write to " + client.name);
                } else {
                    console.log("tls not writable to " + client.name);
                }
            } catch (err) {
                console.log("tls cannot send message. " + err);
                console.log("tls Splice di " + client.name);
                res.tlssockets.splice(res.tlssockets.indexOf(client), 1);
            }
        });
    }

    //    If there are no sockets, then don't broadcast any messages
    if (res.sockets.length === 0) {
        console.log("Nessun plain");
    } else {
        // If there are clients remaining then broadcast message
        res.sockets.forEach(function(client, index, array) {
            try {
                if (client.writable) {
                    var date = new Date();
                    client.write("agisci " + date + "\r\n");
                    notificati = notificati + 1;
                    console.log("write to " + client.name);
                } else {
                    logger.info("not writable to " + client.name);
                }
            } catch (err) {
                console.log("cannot send message. " + err);
                console.log("Splice di " + client.name);
                res.sockets.splice(res.sockets.indexOf(client), 1);
            }
        });
    }

    res.render('citofono', { title: 'Operazione citofonica', notificati: notificati });

});

module.exports = router;
