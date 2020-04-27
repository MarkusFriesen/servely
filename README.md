# Servely
![logo](./logo.png)

Servely is an open-source fullstack JavaScript application, with a Node.js + Lowdb + GraphQL serverside, and ReactJS on the client side.
The project is a simple ordering system that lets an organization add their purchasable items, and create orders for those items. 

## Build Status
[![Actions Status](https://github.com/MarkusFriesen/order/workflows/Build+Test%20CI/badge.svg)](https://github.com/MarkusFriesen/order/actions)

## Getting Started
### Prerequisites

1. NodeJS >= 12

### Install
```bash 
npm i 

#Transpile & deploy client side code
cd .\src\client\ 
npm i
npm run deploy

#Transpile and start server side code 
cd ..\..
npm run build
npm start
```

#### Server
The server is initialized in ```src\server\server.js``` 

#### Client side
The client is initialized in ```src\client\js``` and was build with create-react-app

## Known limitations
LowDb is used since the app needs to run on a RaspberryPi. This measns the db shouldn't exceed a size of 200mb. 
