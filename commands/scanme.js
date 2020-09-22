const Discord = require('discord.js');
const axios = require('axios');

function handleRoleError(error) {
    console.log(error);
}

function getRandomRoleMessage(level) {
    const messages = [ [
        "Now entering Hanamura.",
        "Welcome to Summer's Rift.",
        "Impressive!",
        "The Force is strong with this one.",
        "I stopped caring a long time ago.",
        "I don't care what they say about me. I just want to eat.",
        "The doctor is in.",
        "That's my spot!"
    ],
    [
        "I've done a lot more for a lot less.",
        "I can do this all day.",
        "I am Beyonce always.",
        "Sometimes you gotta work a little so you can ball a lot!",
        "I'm exceedingly smart."
    ],
    [
        "Legendary!",
        "You have my respect, Stark.",
        "We have a Hulk.",
        "Killing spree."
    ],
    [
        "...Destiny still arrives. Or should I say, I have.",
        "Godlike!",
        "Power! Unlimited power!",
        "SILENCE, MORTALS!"
    ] ];

    const lvl_index = parseInt(Math.random() * level);
    const message_index = parseInt(Math.random() * messages[lvl_index].length);

    return messages[lvl_index][message_index];
}

function execute(message, args, user_data) {
    var author_data = null;

    const user_guild = user_data[message.guild.id];
    if (user_guild != null && user_guild["users"] != null) {
        author_data = user_guild["users"][message.author.id];
    }

    //User has not provided their details
    if (author_data == null) {
        message.channel.send("Hold your horses, cowboy! You need to register yourself before asking me to scan you!" +
                             "Try using `!sensei registerme` first.");
        return;
    }

    axios.get(`https://www.codewars.com/api/v1/users/${author_data["username"]}/code-challenges/completed`)
        .then(response => {
            user_kata_list = response.data.data;

            const role_cache = message.guild.roles.cache;
            const role_samurai = role_cache.find(r => r.name.startsWith("Kata Samurai"));
            const role_ninja = role_cache.find(r => r.name.startsWith("Kata Ninja"));
            const role_shogun = role_cache.find(r => r.name.startsWith("Kata Shogun"));
            const role_god = role_cache.find(r => r.name.startsWith("Kata God"));

            if (user_data[message.guild.id] == null) {
                user_data[message.guild.id] = {};
            }

            var guild_data = user_data[message.guild.id];

            //No katas registered
            if (guild_data["kata_list"] == null) {
                return;
            }

            //Check registered kata count
            const registered_kata_count = 4;
            if (guild_data["kata_list"].length > registered_kata_count) {
                console.error(`You have registered more than ${registered_kata_count} katas (${guild_data["kata_list"].length}).`);
                return;
            }

            //Find completed katas
            var completed_kata = new Array(registered_kata_count);
            for (var i = 0; i < guild_data["kata_list"].length; ++i) {
                kata = guild_data["kata_list"][i];

                if (kata == null) {
                    continue;
                }

                for (const user_kata of user_kata_list) {
                    if (user_kata.id === kata.id) {
                        completed_kata[i] = true;
                        continue;
                    }
                }
            }

            //Clear existing roles
            var member_roles = message.member.roles;
            member_roles.remove(role_god).catch(handleRoleError);
            member_roles.remove(role_shogun).catch(handleRoleError);
            member_roles.remove(role_ninja).catch(handleRoleError);
            member_roles.remove(role_samurai).catch(handleRoleError);

            //Assign roles
            if (completed_kata[0] && completed_kata[1] && completed_kata[2] && completed_kata[3]) {
                member_roles.add(role_god).catch(handleRoleError);
                role_level = 1;
            } else if (completed_kata[0] && completed_kata[1] && completed_kata[2]) {
                member_roles.add(role_shogun).catch(handleRoleError);
                role_level = 2;
            } else if (completed_kata[0] && completed_kata[1]) {
                member_roles.add(role_ninja).catch(handleRoleError);
                role_level = 3;
            } else if(completed_kata[0] || completed_kata[1] || completed_kata[2] || completed_kata[3]) {
                member_roles.add(role_samurai).catch(handleRoleError);
                role_level = 4;
            }

            //A role was assigned
            if (role_level > 0) {
                //Set role update time
                guild_data["users"][message.author.id]["role_update_time"] = Date.now();

                var role_name = "";
                var role_color = "";

                switch(role_level) {
                case 1:
                    role_name = "Kata Samurai";
                    role_color = "#3498DB";
                    break;
                case 2:
                    role_name = "Kata Ninja";
                    role_color = "#EE0BE4";
                    break;
                case 3:
                    role_name = "Kata Shogun";
                    role_color = "#FF8000";
                    break;
                case 4:
                    role_name = "Kata God";
                    role_color = "#F1C40F";
                    break;
                default:
                    role_name = "Wait, what?";
                    break;
                }

                const roleChangeEmbed = new Discord.MessageEmbed()
                    .setTitle(`${message.author.username} is now a ${role_name}!`)
                    .setDescription(getRandomRoleMessage(role_level))
                    .setColor(role_color);

                message.channel.send(roleChangeEmbed);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

module.exports = {
    name: "scanme",
    needs_privilege: false,
    channel_name: "submissions",
    callback: execute
}