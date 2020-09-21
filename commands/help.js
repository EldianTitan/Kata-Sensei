function execute(message, args, user_data) {
    const is_moderator = message.member.roles.cache.some(role => role.name.toLowerCase().startsWith('moderator'));
    const is_admin = message.member.hasPermission(['ADMINISTRATOR']);

    if (!is_moderator && !is_admin) {
        message.channel.send("Hmmm, adequate permission you have not! Moderator you must be."); //Get it? Its Yoda.
        return;
        }

        const Discord = require('discord.js');

        // inside a command, event listener, etc.
        const exampleEmbed = new Discord.MessageEmbed()
        	.setColor('#FF0000')
        	.setTitle('Kata Bot Help Commands')
        	.setURL('https://discord.js.org/')
        	.setAuthor('Bruce Lee', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        	.setDescription('Bruce Lee is a really cool guy that made this kata bot so you can be as cool as him')
        	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
        	.addFields(
        		{ name: 'Commands', value: 'On the menu today is newkata, registerme and scanme there is also'+
        		 ' a help command but I think you already know that.'},
        		{ name: '\u200B', value: '\u200B' },
        		{ name: 'newkata', value: 'The way to use this command is ' +
        		'`!sensei newkata <kata_level> <kata_id_or_slug>`' + 'this command is for assigning new katas'
        		, inline: true },
        	)
        	.addField('Inline field title', 'Some value here', true)
        	.setImage('https://i.imgur.com/wSTFkRM.png')
        	.setTimestamp()
        	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

        channel.send(exampleEmbed);
    }

module.exports = {
    name: "help",
    callback: execute
}