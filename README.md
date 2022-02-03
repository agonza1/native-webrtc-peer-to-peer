# native-webrtc-peer-to-peer
A basic native WebRTC peer to peer Web App implementation

It includes a web client and a signaling server for clients to connect and do signaling for WebRTC.

It uses [adapter.js](https://github.com/webrtc/adapter) for WebRTC and [socket.io](https://socket.io/) for signaling

### Dependencies

* [NodeJS](https://nodejs.org)
* [Docker](https://www.docker.com)

### Starting with Docker

Go to the directory that has your Dockerfile and run the following command to build the Docker image. The -t flag lets you tag your image so it's easier to find later using the docker images command:

```
docker build . -t <your username>/webrtc-app
```

Run the image you previously built:

```
docker run -p 8080:80 -d <your username>/webrtc-app
```

### Starting and debugging (without docker)

For debugging all logs:

```DEBUG=* node index.js```

For just running without debugging:

```node index.js```

### Credit where credit is due:

Initial code from https://github.com/googlecodelabs/webrtc-web