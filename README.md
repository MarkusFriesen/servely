# BIt

BestellIt is an open-source fullstack JavaScript application, with a Node.js lowdb GraphQL serverside, and ReactJS on the client side.
The project is a simple ordering system that lets an organization add their purchasable items, and create orders for those items. 

[![Actions Status](https://github.com/MarkusFriesen/order/workflows/Node.js%20CI/badge.svg)](https://github.com/MarkusFriesen/order/actions)

## Getting Started TL;DR: 
### Prerequisites

1. NodeJS >= 12

### Install
```
npm install 
```

#### Server
The server is initialized in ```src\server\server.js``` 

To start the server, execute the following commands in sepperate terminal instaces

> Compile client side code
```bash
cd .\src\client\
npm i
npm run deploy
cd ..\..
```

> Start Node.js server
```bash
npm run build
npm start
```

#### Client side
The client is initialized in ```src\client\js``` and was build with create-react-app
