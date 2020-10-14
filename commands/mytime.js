const Discord = require('discord.js');
const axios = require('axios');

const one_hour_ms = 60 * 60 * 1000;
const one_week_ms = 7 * 24 * one_hour_ms;

function millisecondsToStringDate(time) {
    var sec = parseInt(time / 1000);
    var min = parseInt(sec / 60);
    var hours = parseInt(min / 60);
    var days = parseInt(hours / 24);

    sec = sec - 60 * min;
    min = min - 60 * hours;
    hours = hours - 24 * days;

    return days + ":" + (hours + ":" + min + ":" + sec);
}

function execute(message, args, user_data) {
    var author_data = null;

    const user_guild = user_data[message.guild.id];
    if (user_guild != null && user_guild["users"] != null) {
        author_data = user_guild["users"][message.author.id];
    }

    //User has not provided their details
    if (author_data == null) {
        message.channel.send("Hold your horses, cowboy! You need to register yourself before first!" +
                             "Try using `!sensei registerme` first.");
        return;
    }

    if (author_data["role_update_time"] == null) {
        const role_embed = new Discord.MessageEmbed()
            .setTitle("No time records!")
            .setDescription("You need a role.")
            .setColor("#99AAB5");

        message.channel.send(role_embed);
    } else {
        const current_time = Date.now();
        const end_time = author_data["role_update_time"] + one_week_ms;
        const remaining_time = end_time - current_time;

        var dateStr = millisecondsToStringDate(remaining_time);

        const role_embed = new Discord.MessageEmbed()
            .setTitle("Time left on your current role:")
            .setDescription(dateStr)
            .setColor("#99AAB5");

        message.channel.send(role_embed);
    }
}

module.exports = {
    name: "mytime",
    needs_privilege: false,
    callback: execute,
    millisToStringDate: millisecondsToStringDate
}