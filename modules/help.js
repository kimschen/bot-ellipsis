'use strict'

const Discord = require('discord.js');

module.exports.run = async(message) => {
  
        const helpCommandEmbed = new Discord.RichEmbed()
        .setColor('#fbb3ff')
        .setAuthor("Hi, I'm Ellipsis, which game content you're looking for?")
        .setDescription('Command Prefix : `...`')
        .addField('❯ HELLDIVERS™', '`hd`', true)
        .addField('❯ Portal Knights', '`pk`', true)
        .setTimestamp()
        .setFooter('Ellipsis');

        message.channel.send(helpCommandEmbed);

}