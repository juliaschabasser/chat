let users = [];

//Add user
function addUser({id, username, chatRoomName}) {
    username = username.trim().toLowerCase();
    chatRoomName = chatRoomName.trim().toLowerCase();

    if(!username || !chatRoomName) {
        return {
            error: "Username and chatroomname must be filled out."
        }
    }

    const existingUser = users.findIndex(user => {
        return user.chatRoomName === chatRoomName && user.username === username
    })

    if(existingUser !== -1) {
        return {
            error: "Username already exists for this chatroom! Please choose another one!"
        }
    }

    users.push({id, username, chatRoomName})

    return {id, username, chatRoomName}
}

function getAllUsersOfRoom(userroom) {
    const allUsersInRoom = users.filter(user => user.chatRoomName === userroom);
    return allUsersInRoom;
}

function removeUser(id) {
    const index = users.findIndex(user => {
        return user.id === id
    })

    if(index !== -1) {
        var removed = users.splice(index, 1)[0];
        return removed
    }
}

function findUser(id) {
    var found = users.find(user => {
        return user.id === id
    })

    return found;
}

module.exports = {
    addUser,
    removeUser, 
    findUser,
    getAllUsersOfRoom
}