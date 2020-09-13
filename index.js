const Discord = require('discord.js');
const include = require('./include.js');

// const path = require('path');
// const fs = require('fs');

//Register bot commands
command_registry = [
    {
        name: 'scanme',
        //channel: { type: 'text', name: 'general' },
        callback: function(message) {
            message.channel.send("Scanning...");
        }
    },
    {
        name: 'registerme',
        callback: function(message) {
            message.channel.send("Omae wa mou shindeiru!");
        }
    }
]

//Setup bot client instance
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Kata-Sensei is ready!');
});

//Command processing
const sensei_command = '!sensei';

client.on('message', message => {
	if (!message.content.startsWith(sensei_command) || message.author.bot) return;

    //This is a Kata-Sensei command
    var args = message.content.slice(sensei_command.length).split(' ').filter(e => { return !(e === '') });

    console.log(args);
    if (args.length == 0) {
        message.channel.send('Hmmmm... seems you forgot to specify a command!');

        return;
    }
    
    var valid_command = false;

    for (const command of command_registry) {
        if (args[0] === command.name) {
            command.callback(message);
            valid_command = true;

            break;
        }
    }

    if (!valid_command) {
        message.channel.send('Oops, I don\' understand the command you gave me!');

        return;
    }

    //Delete the message the user sent
    message.delete();
});

//Launch the bot
client.login(include.config.token);