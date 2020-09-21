function execute(message, args, user_data) {
    const is_moderator = message.member.roles.cache.some(role => role.name.toLowerCase().startsWith('moderator'));
    const is_admin = message.member.hasPermission(['ADMINISTRATOR']);

        const Discord = require('discord.js');

        // inside a command, event listener, etc.
        const exampleEmbed = new Discord.MessageEmbed()
        	.setColor('#FF0000')
        	.setTitle('Kata Bot Help Commands')
        	.setURL('https://discord.js.org/')
        	.setAuthor('Jiagi', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
        	.setDescription('Jiagi is a really cool guy that made this kata bot so you can be as cool as GunGuy')
        	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
        	.addFields(
        		{ name: 'Commands', value: 'On the menu today is newkata, registerme and scanme there is also'+
        		 ' a help command but I think you already know that.'},
        		{ name: '\u200B', value: '\u200B' },
        		{ name: 'newkata', value: 'The way to use this command is ' +
        		'`!sensei newkata <kata_level> <kata_id_or_slug>`' + ' this command is for assigning new katas'
        		, inline: false },
        		{ name: '\u100B', value: '\u100B' },
        		{ name: 'registerme', value: 'The way to use this command is ' +
                        		'`!sensei registerme <codewars_username>`' +
                        	    ' this command is for registering yourself for scans'
                        		, inline: false },
                { name: '\u100B', value: '\u100B' },
                { name: 'scanme', value: 'The way to use this command is ' +
                              '`!sensei scaneme`' +
                              ' this command is for scanning and giving yourself roles REMEMBER TO REGISTER FIRST'
                                        		, inline: false }
        	)
        	.setImage('https://i.imgur.com/wSTFkRM.png')
        	.setTimestamp()
        	.setFooter('Earth was here', 'https://i.imgur.com/wSTFkRM.png');

        message.channel.send(exampleEmbed);
    }

module.exports = {
    name: "help",
    needs_privilege: false,
    channel_name: "general",
    callback: execute
}