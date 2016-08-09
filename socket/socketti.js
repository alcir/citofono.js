var sockets = require('../app').sockets;
var tlssockets = require('../app').tlssockets;

tcpserver.on('connection', function(socket) {

    socket.name = socket.remoteAddress + ':' + socket.remotePort;

    socket.setTimeout(5000);

    //sockets.push(socket);

    console.log('Connessione: ' + socket.remoteAddress + ':' + socket.remotePort);

    socket.write("Welcome");

    socket.on('data', function(data) {

      var textChunk = data.toString('utf8').replace(/\s+/g, ' ').trim();

      console.log("ricevuto " + textChunk + " da " + socket.name);

      if ( textChunk != "TOKENSEGRETISSIMO") {
        console.log("token errato " + socket.name)
        socket.destroy();
      } else {
        console.log("Token ok " + socket.name)
        if ( sockets.indexOf(socket) == -1 ) {
            console.log("Aggiungo " + socket.name + " ai destinatari");
            sockets.push(socket);
        }
      }

    });

    socket.on('error', function(e) {
        console.log('System', e ? e : 'A unknown error occurred');
    });

    socket.on('end', function() {

        console.log(socket.name + " left the broadcast.\n");

        sockets.splice(sockets.indexOf(socket), 1);

    });

    socket.on('error', function(error) {

        console.log('Socket got problems: ', error.message);

    });
});


////////////////


tlsserver.on('secureConnection', function(tlssocket) {

    tlssocket.name = tlssocket.remoteAddress + ":" + tlssocket.remotePort

    tlssocket.on('data', function(data) {

      var textChunk = data.toString('utf8').replace(/\s+/g, ' ').trim();

      console.log("ricevuto " + textChunk + " da " + tlssocket.name);

      if ( textChunk != "TOKENSEGRETISSIMO") {
        console.log("token errato " + tlssocket.name)
        tlssocket.destroy();
      } else {
        console.log("Token ok " + tlssocket.name)
        if ( tlssockets.indexOf(tlssocket) == -1 ) {
            console.log("Aggiungo " + tlssocket.name + " ai destinatari");
            tlssockets.push(tlssocket);
        }
      }

    });

    //tlssocket.setKeepAlive(1, 1000);

    tlssocket.setTimeout(60000, function() {
      console.log('Timeout tls ' + tlssocket.name);
      tlssocket.destroy();
    });

    console.log('New tls connection: ' + tlssocket.remoteAddress + ':' + tlssocket.remotePort);

    tlssocket.on('error', function(e) {
        console.log('System', e ? e : 'A unknown error occurred');
    });

    tlssocket.on('end', function() {
        console.log(tlssocket.name + " left the tls broadcast.\n");
        console.log("tls Splice di " + tlssocket.name);
        tlssockets.splice(tlssockets.indexOf(tlssocket), 1);
    });

    tlssocket.on("close", function() {
        console.log("Close:" + tlssocket.name);
        console.log("tls Splice di " + tlssocket.name);
        tlssockets.splice(tlssockets.indexOf(tlssocket), 1);
    });
});
