var socket = io();

var urlParams = new URLSearchParams(window.location.search);

function submitForm() {
    const message = document.getElementById('message').value;
    socket.emit('getMessage', message)
}

function emitLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((showPosition) => {
            console.log(showPosition);
            const long = showPosition.coords.longitude;
            const lat = showPosition.coords.latitude;

            socket.emit('emitLocation', {long: long, lat: lat})
        })
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
}

socket.on('displayAllUsersOfRoom', function(allUsers) {
    var div = document.querySelector('div.userList');
    div.innerHTML = "";
    allUsers.forEach(element => {
        displayAllUsers(element.username)
    });
})

socket.on('sendWelcomeMessage', function(welcomeMessage) {
    addInfo(welcomeMessage)
})

socket.on('userHasJoined', function(newUserMessage) {
    addInfo(newUserMessage)
})

socket.on('sendMessageToAllUsers', function(message) {
    addText(message)
})

socket.on('sendLocation', function(location) {
    console.log(location);
    const message = `https://www.google.com/maps/search/?api=1&query=${location.text.long},${location.text.lat}`
    addLink({text: message, time: location.time})
})

socket.on('userLoggedOut', function(message) {
    addText(message);
})

function addText(message) {
    var div = document.querySelector('div');

    const markup = `
    <div>
        <span>${message.time}</span>&nbsp;
        <span>${message.user}</span>&nbsp;
        <span>${message.text}</span>
    </div>
    `

    div.insertAdjacentHTML('beforeend', markup);
}

function addLink(message) {
    const textMessage = "My Location"

    var div = document.querySelector('div');

    const markup = `
    <div>
        <span>${message.time}</span>&nbsp;
        <span>${message.user}</span>&nbsp;
        <a href="${message.text}">My Location</a>
    </div>
    `

    div.insertAdjacentHTML('beforeend', markup);
}

function addInfo(message) {
    var div = document.querySelector('div');

    const markup = `
    <div>
        <span>${message.time}</span>&nbsp;
        <span>${message.text}</span>
    </div>
    `

    div.insertAdjacentHTML('beforeend', markup);
}

function displayAllUsers(username) {
    var div = document.querySelector('div.userList');
    const markup = `
        <span>${username}</span>&nbsp;
    `

    div.insertAdjacentHTML('beforeend', markup);
}

socket.emit('join', {username: urlParams.get('username'), chatRoom: urlParams.get('chatRoomName')}, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    }
})