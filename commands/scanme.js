const axios = require('axios');

function execute(message, args, user_data) {
    var author_data = user_data["users"][message.author.username];

    //User has not provided their details
    if (author_data == null) {
        message.channel.send("Hold your horses, cowboy! You need to register yourself before asking me to scan you!" +
                             "Try using `!sensei registerme` first.");
        return;
    }

    axios.get(`https://www.codewars.com/api/v1/users/${author_data["username"]}/code-challenges/completed`)
        .then(response => {
            kata_list = response.data.data;

            for (const kata of kata_list) {
                message.channel.send(kata.name);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

module.exports = {
    name: "scanme",
    callback: execute
}