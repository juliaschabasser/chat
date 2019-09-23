const path = require('path');
var express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var getMessage = require('./models/message')
const {addUser, removeUser, findUser, getAllUsersOfRoom} = require('./models/users')

let allUsers = [];

app.use('/', express.static(path.join(__dirname, '../public')));

io.on('connection', function(socket){

  socket.on('join', function(data, callback) {

    const {user, error} = addUser({id: socket.id, username: data.username, chatRoomName: data.chatRoom})

    if(error) {
      return callback(error)
    }

    socket.join(data.chatRoom)

    allUsers = getAllUsersOfRoom(data.chatRoom)
    io.to(data.chatRoom).emit('displayAllUsersOfRoom', allUsers)


    const message = `Welcome ${data.username}`;
    const message1 = `User ${data.username} has joined!`
    socket.emit('sendWelcomeMessage', getMessage(message, data.username))
    socket.broadcast.to(data.chatRoom).emit('userHasJoined', getMessage(message1, data.username))
  })

  socket.on('getMessage', function(message) {

    const user = findUser(socket.id);

    io.to(user.chatRoomName).emit('sendMessageToAllUsers', getMessage(message, user.username))
  })

  socket.on('emitLocation', function(location) {

    const user = findUser(socket.id);

    io.to(user.chatRoomName).emit('sendLocation', getMessage(location, user.username))
  })

  socket.on('disconnect', function(){

    const user = removeUser(socket.id);

    if(user) {
      socket.broadcast.to(user.chatRoomName).emit('userLoggedOut', getMessage(`The user ${user.username} has logged out`, user.username))
    }
  });

});



http.listen(3000, function(){
  console.log('listening on *:3000');
});
