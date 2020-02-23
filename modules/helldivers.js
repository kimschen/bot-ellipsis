'use strict'
/*
|------------------------------------------------------------------------
| This module is exporting function to display game contents by matching
| the command 'args' with the image path 'name' and display accordingly
|------------------------------------------------------------------------
*/

const Discord = require('discord.js');

module.exports.cntHelldivers = function (receivedCommand, fs, message) {

  let content = receivedCommand.content.toLowerCase().substr(7);  
  let hdWeaponImagePath  = "/app/img_weapon/"+content+".png";
  let hdDefensiveImagePath = "/app/img_stratagem/defensive/"+content+".png";
  let hdOffensiveImagePath = "/app/img_stratagem/offensive/"+content+".png";
  let hdSpecialImagePath = "/app/img_stratagem/special/"+content+".png";
  let hdSupplyImagePath = "/app/img_stratagem/supply/"+content+".png";

  if (content) {

    // HD Weapon Image
    if (fs.existsSync(hdWeaponImagePath)) {
      receivedCommand.channel.send(message.helldivers.weapon[content], {files: [hdWeaponImagePath]});
    }

    // HD Defensive Stratagem Image
    if (fs.existsSync(hdDefensiveImagePath)) {
      receivedCommand.channel.send(message.helldivers.defensive[content], {files: [hdDefensiveImagePath]});
    }

    // HD Offensive Stratagem Image
    if (fs.existsSync(hdOffensiveImagePath)) {
      receivedCommand.channel.send(message.helldivers.offensive[content], {files: [hdOffensiveImagePath]});
    }

    // HD Special Stratagem Image
    if (fs.existsSync(hdSpecialImagePath)) {
      receivedCommand.channel.send(message.helldivers.special[content], {files: [hdSpecialImagePath]});
    }

    // HD Supply Stratagem Image
    if (fs.existsSync(hdSupplyImagePath)) {
      receivedCommand.channel.send(message.helldivers.supply[content], {files: [hdSupplyImagePath]});
    }

  }
}

module.exports.cntEmbedCommand = function (receivedCommand, command, embed) {

      let cmd = '';
      let stratagems = {
        "offensive" : [],
        "defensive" : [],
        "supply"    : [],
        "weapon"    : [],
        "special"   : []
      };

      for (cmd in command.helldivers.offensive) {
        stratagems.offensive.push("`"+command.helldivers.offensive[cmd]+"` | ");
      }
      for (cmd in command.helldivers.defensive) {
        stratagems.defensive.push("`"+command.helldivers.defensive[cmd]+"` | ");
      }
      for (cmd in command.helldivers.supply) {
        stratagems.supply.push("`"+command.helldivers.supply[cmd]+"` | ");
      }
      for (cmd in command.helldivers.weapon) {
        stratagems.weapon.push("`"+command.helldivers.weapon[cmd]+"` | ");
      }
      for (cmd in command.helldivers.special) {
        stratagems.special.push("`"+command.helldivers.special[cmd]+"` | ");
      }

      let helldiversEmbed = new Discord.RichEmbed(embed)
      // .setAuthor('HELLDIVERS™', 'https://steamuserimages-a.akamaihd.net/ugc/88224496145598035/E12BE9A061F526B4898A69E81B26D19148525FC3/','https://helldivers.gamepedia.com/Stratagems')
      .setThumbnail('https://steamuserimages-a.akamaihd.net/ugc/88224496145598035/E12BE9A061F526B4898A69E81B26D19148525FC3/')
      .addField('❯ Offensive Stratagems', stratagems.offensive.join(" "))
      .addField('❯ Defensive Stratagems', stratagems.defensive.join(" "))
      .addField('❯ Supply Stratagems', stratagems.supply.join(" "))
      .addField('❯ Weapons', stratagems.weapon.join(" "))
      .addField('❯ Special Stratagems', stratagems.special.join(" "))
      .addField('❯ Transmitter Objective Key','`trans`')
      .setTimestamp()
      .setFooter('Ellipsis');

      receivedCommand.channel.send(helldiversEmbed);
}
