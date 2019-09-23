const message = function createMessage(text, user) {

    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return {
        text: text,
        time: time, 
        user: user
    }
}

module.exports = message