const axios = require('axios');

function handleRoleError(error) {
    console.log(error);
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
            } else if (completed_kata[0] && completed_kata[1] && completed_kata[2]) {
                member_roles.add(role_shogun).catch(handleRoleError);
            } else if (completed_kata[0] && completed_kata[1]) {
                member_roles.add(role_ninja).catch(handleRoleError);
            } else if(completed_kata[0] || completed_kata[1] || completed_kata[2] || completed_kata[3]) {
                member_roles.add(role_samurai).catch(handleRoleError);
            }

            //A role was assigned
            if (completed_kata[0] || completed_kata[1] || completed_kata[2] || completed_kata[3]) {
                //Set role update time
                guild_data["users"][message.author.id]["role_update_time"] = Date.now();
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