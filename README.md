# BIt

BestellIt is an open-source fullstack JavaScript application, with a Node.js MongoDB GraphQL serverside, and ReactJS on the client side.
The project is a simple ordering system that lets an organization add their purchasable items, and create orders for those items. 


## Getting Started TL;DR: 
### Prerequisites

1. NodeJS 
2. MongoDb


### Install
```
npm install 
```

#### Server
The server is initialized in ```src\server\server.js``` 

To start the server, execute the following commands in sepperate terminal instaces

> Compile client side code
```
cd .\src\client\
npm install
npm run deploy
cd ..\..
```

> Start mongo database (See: `.\src\server\config.js`)
```
mongod
```

> Start Node.js server
```
npm start
```

#### Client side
The client is initialized in ```src\client\js``` and was build with create-react-app
