const express = require('express');
const { createServer, get } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const crypto = require('crypto');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

const stocks = ['REL', 'JIO', 'TATA', 'ADANI'];

function getPrice() {
  return crypto.randomInt(30, 100);
}

// const getStock = crypto.randomInt(0, 4)[stocks];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  setInterval(() => {
    const stockPrice = {};
    stocks.forEach((stock) => {
      const price = getPrice();
      stockPrice[stock] = price;
      io.emit(stock, [new Date().toISOString(), price, stock]);
    });

    io.emit('marketwatch', stockPrice);
  }, 1000);
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
