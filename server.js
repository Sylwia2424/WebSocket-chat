const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const messages = [];	
let users = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(8000, () => {
console.log('Server is running on Port:', 8000)
});
const io = socket(server);

// find new connection (socket) and listen to event (message)
io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('join', (user) => {

    console.log('New user' + socket.id + 'added!');
    users.push(user);
    socket.broadcast.emit('user', user);
    socket.broadcast.emit('join', user);
    console.log('Oh, ' +  user + ' has joined the conversation!');
  });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    for (let activeUser of users) {
      if (activeUser.id === socket.id) {
        const index = users.indexOf(activeUser);
        users.removeUser(activeUser.id, index);
        socket.broadcast.emit('leave', activeUser.user);
      }
    }
  });
});