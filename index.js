const Discord = require('discord.js');

const path = require('path');
const fs = require('fs');

//Setup bot client instance
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Kata-Sensei is ready!');
});

const config_file = require('./config.json');

const user_data_dir = './user_data';
if (!fs.existsSync(user_data_dir)) {
    fs.mkdirSync(user_data_dir);
}

var user_data_file = `${user_data_dir}/user_data.json`;
if (!fs.existsSync(user_data_file)) {
    fs.writeFileSync(user_data_file, '');
}

var user_data = {};

{
    var user_data_contents = fs.readFileSync(user_data_file);
    if (user_data_contents.toString().trim() != "") {
        user_data = JSON.parse(user_data_contents);
    }
}

//Register bot commands
command_registry = []

for (var command_file of fs.readdirSync("./commands")) {
    const command = require(`./commands/${command_file}`);
    command_registry.push(command)

    console.log(`Loading command '${command.name}'`);
}

//Command processing
const sensei_command = '!sensei';

client.on('message', message => {
	if (!message.content.startsWith(sensei_command) || message.author.bot) return;

    //This is a Kata-Sensei command
    var args = message.content.slice(sensei_command.length).split(' ').filter(e => { return !(e === '') });

    if (args.length == 0) {
        message.channel.send('Hmmmm... seems you forgot to specify a command!');

        return;
    }
    
    var valid_command = false;

    for (const command of command_registry) {
        if (args[0] === command.name) {
            valid_command = true;

            if (command) {
                const is_moderator = message.member.roles.cache.some(role => role.name.toLowerCase().startsWith('moderator'));
                const is_admin = message.member.hasPermission(['ADMINISTRATOR']);
                
                if (!is_moderator && !is_admin) {
                    message.channel.send("Hmmm, adequate permission you have not! Moderator you must be."); //Get it? Its Yoda.
                    break;
                }
            }

            command.callback(message, args, user_data);
            
            break;
        }
    }

    if (!valid_command) {
        message.channel.send('Oops, I don\'t understand the command you gave me!');

        return;
    }
});

//Create timing fuinctions to keep track of roles
const one_hour_ms = 60 * 60 * 1000;
const one_week_ms = 7 * 24 * one_hour_ms;

function clearUserRoles(guild_id, user_id, user) {
    user["role_update_time"] = null;

    client.guilds.fetch(guild_id).then(guild => {
        const role_cache = guild.roles.cache;
        const role_samurai = role_cache.find(r => r.name.startsWith("Kata Samurai"));
        const role_ninja = role_cache.find(r => r.name.startsWith("Kata Ninja"));
        const role_shogun = role_cache.find(r => r.name.startsWith("Kata Shogun"));
        const role_god = role_cache.find(r => r.name.startsWith("Kata God"));

        guild.members.fetch(user_id).then(member => {
            member.roles.remove(role_god);
            member.roles.remove(role_shogun);
            member.roles.remove(role_ninja);
            member.roles.remove(role_samurai);

            //TODO: Print message
        }).catch(err => {
            console.error("Error: ", err);
        });
    }).catch(err => {
        console.error("Error: ", err);
    });
}

function narrowUpdateRoles(guild_id, user_id, user) {
    if (user == null) {
        return;
    }

    const current_time = Date.now();
    const end_time = user["role_update_time"] + one_week_ms;
    const remaining_time = end_time - current_time;

    if (remaining_time <= 0) {
        clearUserRoles(guild_id, user_id, user);
        return;
    }

    //Create timeout event for user
    setTimeout(clearUserRoles, remaining_time, guild_id, user_id, user);
}

function broadUpdateRoles() {
    console.log("Broad update");

    for (const guild_id in user_data) {
        var guild_data = user_data[guild_id];

        if (guild_data["users"] == null) {
            continue;
        }

        const current_time = Date.now();
    
        for (const user_id in guild_data["users"]) {
            var user = guild_data["users"][user_id];
            if (user["role_update_time"] == null) {
                continue;
            }
    
            const end_time = user["role_update_time"] + one_week_ms;
            const remaining_time = end_time - current_time;
            
            //If remaining time is less that one hour,
            //create a timer to keep track of role
            if (remaining_time <= one_hour_ms) {
                narrowUpdateRoles(guild_id, user_id, user);
            }
        }
    }
}

//Create an event handler for when the bot terminates
process.stdin.resume();

function exitCallback(options, exitCode) {
    if (options.cleanup) {
        console.log("*In Darth Vader's voice*: Nooooooooo!");

        const data = JSON.stringify(user_data);
        fs.writeFileSync(user_data_file, data);
    }
    
    if (options.exception) {
        console.log("Uncaught exception");
    }

    if (options.exit) {
        process.exit();
    }
}

process.on('exit', exitCallback.bind(null, { cleanup: true }));
process.on('SIGINT', exitCallback.bind(null, { exit: true }));
process.on('SIGUSR1', exitCallback.bind(null, { exit: true }));
process.on('SIGUSR2', exitCallback.bind(null, { exit: true }));
//process.on('uncaughtException', exitCallback.bind(null, { exception: true, exit: true }));

//Launch the bot
client.login(config_file.token);

broadUpdateRoles();
setInterval(broadUpdateRoles, one_week_ms);