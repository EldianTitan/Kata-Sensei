const Discord = require('discord.js');

function execute(message, args, user_data) {
    // inside a command, event listener, etc.
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Kata Bot Help Commands')
        .setDescription('Jiagi is a really cool guy that made this kata bot so you can be as cool as GunGuy')
        .addFields(
            { name: 'Commands', value: 'On the menu today is newkata, registerme and scanme there is also'+
              ' a help command but I think you already know that.' },
            { name: '\u200B', 
              value: '`!sensei newkata <kata_level> <kata_id_or_slug>`: ' + 
              'Set a new kata for the specified kata level (1-4).\n' },
            { name: '\u200B',
              value: '`!sensei registerme <codewars_username>`: Register yourself with KataSensei. ' +
              'You only need to do this once. Replace *<codewars_username>* with you CodeWars username. ' + 
              'Capitalization matters.' },
            { name: '\u200B', value: '`!sensei scanme`: ' +
              'Scan yourself for completed challenges to get new roles. REMEMBER TO REGISTER FIRST!' }
        )
        .setTimestamp()
        .setFooter('Earth was here', 'https://i.imgur.com/wSTFkRM.png');

    message.channel.send(helpEmbed);
}

module.exports = {
    name: "help",
    needs_privilege: false,
    callback: execute
}