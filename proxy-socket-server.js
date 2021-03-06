var socket = require('socket.io');
var WebSocket = require('ws');
var app = require('http').createServer();
var conf = require('./lib/config');

var io = socket.listen(app.listen(conf.get('port'), conf.get('host')));

app.on('request', function (req, res) {
    //res.statusCode = 404;
    //res.end();
});

io.on('connection', function (socket) {
    var ws;
    socket.on('auth', function (params) {
        try {
            ws = new WebSocket(conf.get('socket'));
            ws.on('message', function (message) {
                console.log(message);
                socket.emit('message', message);
            });
            ws.on('open', function () {
                ws.send(JSON.stringify(params));
            });
        } catch (err) {
            this.emit('error', error);
        }
    });
    socket.on('message', function (params) {
        console.log(params);
        try {
            ws.send(params);
        } catch (error) {
            this.emit('error', error);
        }
    });
    socket.on('error', function (error) {
        this.emit(error);
    });
    socket.on('disconnect', function () {
        console.log('disconnect');
        ws.close();
    });
});