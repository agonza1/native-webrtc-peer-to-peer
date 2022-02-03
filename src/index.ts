'use strict';

import { NetworkInterfaceInfo, networkInterfaces } from 'os';
import { series } from 'async';
import { Server } from 'socket.io';
import express from 'express';
import express_server from "./config.json";
import { yellow, red, cyan } from 'colors';

const app = express();
app.use(express.static('.'));

// Debugging
import debug from 'debug';
const d = {
  debug: debug('debug'),
  err: debug('error'),
  warn: debug('warn'),
  timer: debug('timer'),
  info: debug('info')
};

// Socket.io connection/message handler
const socket = (http: any) => {
  // console.log(http);
  const io = new Server(http);
  io.on('connection', socket => {
<<<<<<< HEAD
=======
    console.log('connection!')
>>>>>>> master
    // convenience function to log server messages on the client
    const log = (...arg: string[]) => {
      var array = ['Message from server:'];
      array.push.apply(array, arg);
<<<<<<< HEAD
=======
      console.log(array);
>>>>>>> master
      socket.emit('log', array);
    }

    socket.on('message', (message: string) => {
<<<<<<< HEAD
=======
      console.log(message);
>>>>>>> master
      log('Client said: ', message);
      // To support multiple rooms in app, would be room-only (not broadcast)
      socket.broadcast.emit('message', message);
    });

<<<<<<< HEAD
    socket.on('create or join', (room: string) => {
=======
    socket.on('create or join', (room) => {
>>>>>>> master
      log('Received request to create or join room ' + room);

      const clients = io.sockets.adapter.rooms.get(room);
      var numClients = clients ? clients.size : 0;

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

      socket.on("disconnect", () => {
        log('Client ID ' + socket.id + ' disconnected.');
      });
    });

    socket.on('ipaddr', () => {
      const ifaces: NodeJS.Dict<NetworkInterfaceInfo[]> = networkInterfaces();
      for (let dev in ifaces) {
        (ifaces[dev] || []).forEach((details) => {
          if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
            socket.emit('ipaddr', details.address);
          }
        });
      }
    });

  });
}

series([
  // 1. HTTP
  (callback) => {
    console.log(yellow("[1. HTTP]"));
    if(express_server.ws.http_port) {
      const http = require('http').createServer(app);
      socket(http);
      http.on('error', (err: { code: string; }) => {
        d.err('HTTP error:', err)
        if(err.code == 'EADDRINUSE') {
          console.log(yellow('Port ' + express_server.ws.http_port + ' for HTTP backend already in use'));
          callback();
        }
      });
      http.listen(express_server.ws.http_port, () => {
        d.info('HTTP backend listening on *:' + express_server.ws.http_port + ' (HTTP)');
        callback(null, "HTTP backend OK");
      });
    } else {
      callback(null, "No HTTP server backend");
    }
  },
  // 2. HTTPS
  (callback) => {
    console.log(yellow("[2. HTTPS]"));
    if(express_server.ws.https_port) {
      const fs = require('fs');
      const options = {
        key: fs.readFileSync(express_server.ws.key, 'utf8'),
        cert: fs.readFileSync(express_server.ws.cert, 'utf8')
      };
      const https = require('https').createServer(options, app);
      socket(https);
      https.on('error', (err: { code: string; }) => {
        d.err('HTTPS backend error:', err)
        if(err.code == 'EADDRINUSE') {
          console.log(yellow('Port ' + express_server.ws.https_port + ' for HTTPS backend already in use'));
          callback();
        }
      });
      https.listen(express_server.ws.https_port, () => {
        d.info('HTTPS backend listening on *:' + express_server.ws.https_port + ' (HTTPS)');
        callback(null, "HTTPS backend OK");
      });
    } else {
      callback(null, "No HTTPS users backend");
    }
  }
],
(err, results) => {
  if(err) {
    console.log(red("The WebRTC signaling server failed to start"));
    console.log(err);
    process.exit(1);
  } else {
    // We're up and running
    console.log(cyan("Server started!"));
    console.log(results);
  }
});
