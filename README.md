# native-webrtc-peer-to-peer
A basic native WebRTC peer to peer Web App implementation

It includes a web client and a signaling server for clients to connect and do signaling for WebRTC.

It uses [adapter.js](https://github.com/webrtc/adapter) for WebRTC and [socket.io](https://socket.io/) for signaling

### Dependencies

* [NodeJS](https://nodejs.org)

### Starting and debugging

For debugging all logs:

```DEBUG=* node index.js```

For just running without debugging:

```node index.js```

### Credit where credit is due:

Initial code from https://github.com/googlecodelabs/webrtc-web
