const axios = require('axios');

function execute(message, args, user_data) {
    if (args.length != 3) {
        message.channel.send("I don't understand the command. This is the correct syntax:" +
                             "`!sensei newkata <kata_level> <kata_id_or_slug>`");
        return;
    }

    if (args[1] < 1 || args[1] > 4) {
        message.channel.send("Wow, that Kata level doesn't seem right! Kata levels must be between 1 and 4 (inclusive).");
        return;
    }

    axios.get(`https://www.codewars.com/api/v1/code-challenges/${args[2]}`)
        .then(response => {
            message.channel.send(`Kata ${args[1]} has been set to \`${response.data.name}\`!`);

            if (user_data[message.guild.id] == null) {
                user_data[message.guild.id] = {};
            }

            //Kata list does not exist
            if (user_data[message.guild.id]["kata_list"] == null) {
                user_data[message.guild.id]["kata_list"] = [];
            }

            user_data[message.guild.id]["kata_list"][args[1] - 1] = { "name": response.data.name, "id": args[2] };
        })
        .catch(error => {
            if (error.response.status == 404) {
                message.channel.send("The kata provided was not found!");
            } else {
                message.channel.send(`Ooops, an error occured (${error.response.status})!`);
            }
        });
}

module.exports = {
    name: "newkata",
    needs_privilege: true,
    callback: execute
}