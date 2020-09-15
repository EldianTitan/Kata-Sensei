const axios = require('axios');

function execute(message, args, user_data) {
    if (args.length != 2) {
        message.channel.send("I don't understand the command. This is the correct syntax:" +
                             "`!sensei registerme <codewars_username>`");
    } else {
        //Check if username provided is corrent
        axios.get(`https://www.codewars.com/api/v1/users/${args[1]}`)
            .then(response => {
                //Update user details
                if (user_data["users"][message.author.username] == null) { //User not registered
                    message.channel.send("Perfect, you have been registered! Have fun solving katas.");

                    user_data["users"][message.author.username] = {
                        "username": args[1]
                    };
                } else { //User already registered
                    message.channel.send("Your account details have been updated!");

                    user_data["users"][message.author.username]["username"] = args[1];
                }
            })
            .catch(error => {
                if (error.response.status == 404) {
                    message.channel.send("The username you provided does not exist! Try again. (Check your capitalization)");
                } else {
                    message.channel.send(`Ooops, an error occured (${error.response.status})!`);
                }
            });
    }
}

module.exports = {
    name: "registerme",
    callback: execute
}