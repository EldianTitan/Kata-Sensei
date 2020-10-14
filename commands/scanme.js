const Discord = require('discord.js');
const axios = require('axios');

var random_index = parseInt(50 * Math.random());

function numberSequential(offset, length) {
    return (random_index++ % length) + offset;
}

function numberRandom(offset, length) {
    return parseInt(Math.random() * length + offset);
}

function handleRoleError(error) {
    console.log(error);
}

function getRandomRoleMessage(level) {
    const messages = [ [
        "Now entering Hanamura.",
        "Impressive!",
        "The Force is strong with this one.",
        "Welcome to Summer's Rift."
    ],
    [
        "Unstoppable!",
        "I've done a lot more for a lot less.",
        "I can do this all day.",
        "Professionals have standards.",
        "That's my spot."
    ],
    [
        "You have my respect, Stark.",
        "We have a Hulk.",
        "You talking to me?",
        "I'm exceedingly smart.",
        "Samurais, Ninjas, Shoguns... So many snacks, so little time."
    ],
    [
        "...Destiny still arrives. Or should I say, I have.",
        "There is no spoon!",
        "Power! Unlimited power!",
        "AVADA KEDAVRA!"
    ] ];

    var lvl_index = 0;
    switch(level) {
    case 1:
        lvl_index = numberRandom(0, 1);
        break;
    case 2:
        lvl_index = numberRandom(0, 2);
        break;
    case 3:
        lvl_index = numberRandom(1, 2);
        break;
    case 4:
        lvl_index = numberRandom(2, 2);
        break;
    }

    const message_index = numberSequential(0, messages[lvl_index].length);

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
                const roleEmbed = new Discord.MessageEmbed()
                    .setTitle("You haven't registered any katas yet!")
                    .setColor("#550011");
                message.channel.send(roleEmbed);
                
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
            
            var updateRole = false;
            const current_role = guild_data["users"][message.author.id]["role_level"];

            var role_level = 0;
    
            //Assign role
            if (completed_kata[0] && completed_kata[1] && completed_kata[2] && completed_kata[3]) {
                role_level = 4;
            } else if (completed_kata[0] && completed_kata[1] && completed_kata[2]) {
                role_level = 3;
            } else if (completed_kata[0] && completed_kata[1]) {
                role_level = 2;
            } else if(completed_kata[0] || completed_kata[1] || completed_kata[2] || completed_kata[3]) {
                role_level = 1;
            }
            
            if (current_role) {
                if (current_role < role_level) {
                    //A better role has been acquired
                    updateRole = true;
                } else if (current_role > role_level) {
                    var current_role_name = "";
                    var new_role_name = "";

                    //Find role names
                    switch(current_role) {
                    case 1:
                        current_role_name = "Kata Samurai";
                        break;
                    case 2:
                        current_role_name = "Kata Ninja";
                        break;
                    case 3:
                        current_role_name = "Kata Shogun";
                        break;
                    case 4:
                        current_role_name = "Kata God";
                        break;
                    default:
                        current_role_name = "Wait, what?";
                        break;
                    }

                    switch(role_level) {
                    case 1:
                        new_role_name = "Kata Samurai";
                        break;
                    case 2:
                        new_role_name = "Kata Ninja";
                        break;
                    case 3:
                        new_role_name = "Kata Shogun";
                        break;
                    case 4:
                        new_role_name = "Kata God";
                        break;
                    default:
                        new_role_name = "Wait, what?";
                        break;
                    }

                    //Send role message
                    const roleEmbed = new Discord.MessageEmbed()
                        .setTitle(`Your rank is ${new_role_name}. You will stay as ${current_role_name} until it expires!`)
                        .setDescription("Scan yourself again after your current role expires!")
                        .setColor("#99AAB5");

                    message.channel.send(roleEmbed);

                    updateRole = false;
                } else {
                    const roleEmbed = new Discord.MessageEmbed()
                        .setTitle("Nothing to report yet!")
                        .setDescription("Keep trying. You can do it!")
                        .setColor("#99AAB5");
    
                    message.channel.send(roleEmbed);
                }
            } else {
                //No previous role
                updateRole = true;
            }

            //A role was assigned
            if (updateRole && role_level > 0) {
                //Clear existing roles
                var member_roles = message.member.roles;
                member_roles.remove(role_god).catch(handleRoleError);
                member_roles.remove(role_shogun).catch(handleRoleError);
                member_roles.remove(role_ninja).catch(handleRoleError);
                member_roles.remove(role_samurai).catch(handleRoleError);
                
                //Set role update time
                guild_data["users"][message.author.id]["role_update_time"] = Date.now();
                guild_data["users"][message.author.id]["role_level"] = role_level;

                //Set new role and send role update meesage
                var role_name = "";
                var role_color = "";

                switch(role_level) {
                case 1:
                    member_roles.add(role_samurai).catch(handleRoleError);

                    role_name = "Kata Samurai";
                    role_color = "#3498DB";

                    break;
                case 2:
                    member_roles.add(role_ninja).catch(handleRoleError);

                    role_name = "Kata Ninja";
                    role_color = "#EE0BE4";

                    break;
                case 3:
                    member_roles.add(role_shogun).catch(handleRoleError);

                    role_name = "Kata Shogun";
                    role_color = "#FF8000";

                    break;
                case 4:
                    member_roles.add(role_god).catch(handleRoleError);

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
            } else if (updateRole && role_level == 0) {
                const roleEmbed = new Discord.MessageEmbed()
                    .setTitle("Nothing to report yet!")
                    .setDescription("Keep trying. You can do it!")
                    .setColor("#99AAB5");

                message.channel.send(roleEmbed);
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