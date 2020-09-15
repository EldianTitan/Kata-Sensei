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

    if (user_data["users"] == null) {
        user_data["users"] = {}
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
            command.callback(message, args, user_data);
            valid_command = true;
            
            break;
        }
    }

    if (!valid_command) {
        message.channel.send('Oops, I don\'t understand the command you gave me!');

        return;
    }
});

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