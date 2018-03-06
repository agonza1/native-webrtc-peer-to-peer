'use strict';

var os = require('os');
var async = require('async');
var socketIO = require('socket.io');
var express = require('express');
var app = express();
var config = require("./config.js");
var colors = require('colors');

app.use(express.static('.'));

// Debugging
var debug = require('debug');
var d = {
  debug: debug('debug'),
  err: debug('error'),
  warn: debug('warn'),
  timer: debug('timer'),
  info: debug('info')
};

async.series([
  // 1. HTTP
  function(callback) {
    console.log(colors.yellow("[1. HTTP]"));
    if(config.server.ws.http) {
      var http = require('http').Server(app);
      socket(http);
      http.on('error', function(err) {
        d.err('HTTP error:', err)
        if(err.code == 'EADDRINUSE') {
          callback('Port ' + config.server.ws.http + ' for HTTP backend already in use');
        }
      });
      http.listen(config.server.ws.http, function() {
        d.info('HTTP backend listening on *:' + config.server.ws.http + ' (HTTP)');
        callback(null, "HTTP backend OK");
      });
    } else {
      callback(null, "No HTTP server backend");
    }
  },
  // 2. HTTPS
  function(callback) {
    console.log(colors.yellow("[2. HTTPS]"));
    if(config.server.ws.https) {
      var fs = require('fs');
      var options = {
        key: fs.readFileSync(config.server.ws.key, 'utf8'),
        cert: fs.readFileSync(config.server.ws.cert, 'utf8')
      };
      var https = require('https').createServer(options, app);
      socket(https);
      https.on('error', function(err) {
        d.err('HTTPS backend error:', err)
        if(err.code == 'EADDRINUSE') {
          callback('Port ' + config.server.ws.https + ' for HTTPS backend already in use');
        }
      });
      https.listen(config.server.ws.https, function() {
        d.info('HTTPS backend listening on *:' + config.server.ws.https + ' (HTTPS)');
        callback(null, "HTTPS backend OK");
      });
    } else {
      callback(null, "No HTTPS users backend");
    }
  }
],
function(err, results) {
  if(err) {
    console.log(colors.red("The WebRTC signaling server failed to start"));
    console.log(err);
    process.exit(1);
  } else {
    // We're up and running
    console.log(colors.cyan("Server started!"));
    console.log(results);
  }
});

// Socket.io connection/message handler
function socket(http) {
  var io = socketIO.listen(http);
  io.sockets.on('connection', function (socket) {

    // convenience function to log server messages on the client
    function log() {
      var array = ['Message from server:'];
      array.push.apply(array, arguments);
      socket.emit('log', array);
    }

    socket.on('message', function (message) {
      log('Client said: ', message);
      // for a real app, would be room-only (not broadcast)
      socket.broadcast.emit('message', message);
    });

    socket.on('create or join', function (room) {
      log('Received request to create or join room ' + room);

      var clientsInRoom = io.sockets.adapter.rooms[room];
      var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

      log('Room ' + room + ' now has ' + numClients + ' client(s)');

      if (numClients === 0) {
        socket.join(room);
        log('Client ID ' + socket.id + ' created room ' + room);
        socket.emit('created', room, socket.id);

      } else if (numClients === 1) {
        log('Client ID ' + socket.id + ' joined room ' + room);
        io.sockets.in(room).emit('join', room);
        socket.join(room);
        socket.emit('joined', room, socket.id);
        io.sockets.in(room).emit('ready');
      } else { // max two clients
        socket.emit('full', room);
      }
    });

    socket.on('ipaddr', function () {
      var ifaces = os.networkInterfaces();
      for (var dev in ifaces) {
        ifaces[dev].forEach(function (details) {
          if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
            socket.emit('ipaddr', details.address);
          }
        });
      }
    });

  });
}