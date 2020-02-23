'use strict'
/*
|-----------------------------------------------------------------------------
| This module is exporting function to display game secondaryCmds by matching
| the command 'args' with the image path 'name' and display accordingly
|-----------------------------------------------------------------------------
*/

const Discord   = require('discord.js');
const fs        = require('fs');
const info      = require("../info/helldivers.json");
const command   = require("../command.json");
const embedData = require("../embed.json");

module.exports.run = async (message, secondaryCmd) => {

  let hdWeaponImagePath  = "/app/img_weapon/"+secondaryCmd+".png";
  let hdDefensiveImagePath = "/app/img_stratagem/defensive/"+secondaryCmd+".png";
  let hdOffensiveImagePath = "/app/img_stratagem/offensive/"+secondaryCmd+".png";
  let hdSpecialImagePath = "/app/img_stratagem/special/"+secondaryCmd+".png";
  let hdSupplyImagePath = "/app/img_stratagem/supply/"+secondaryCmd+".png";

  if (secondaryCmd) {

    // HD Weapon Image
    if (fs.existsSync(hdWeaponImagePath)) {
      message.channel.send(info.weapon[secondaryCmd], {files: [hdWeaponImagePath]});
    }

    // HD Defensive Stratagem Image
    if (fs.existsSync(hdDefensiveImagePath)) {
      message.channel.send(info.defensive[secondaryCmd], {files: [hdDefensiveImagePath]});
    }

    // HD Offensive Stratagem Image
    if (fs.existsSync(hdOffensiveImagePath)) {
      message.channel.send(info.offensive[secondaryCmd], {files: [hdOffensiveImagePath]});
    }

    // HD Special Stratagem Image
    if (fs.existsSync(hdSpecialImagePath)) {
      message.channel.send(info.special[secondaryCmd], {files: [hdSpecialImagePath]});
    }

    // HD Supply Stratagem Image
    if (fs.existsSync(hdSupplyImagePath)) {
      message.channel.send(info.supply[secondaryCmd], {files: [hdSupplyImagePath]});
    }

  }
  
  // Transmitter objective steps
  if (secondaryCmd === command.helldivers.trans) {
     message.channel.send(info.objective.trans_1 + info.objective.trans_2 + info.objective.trans_3 + info.objective.trans_4);
  }
  

}

module.exports.list = async (message) => {

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

      let helldiversEmbed = new Discord.RichEmbed(embedData)
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

      message.channel.send(helldiversEmbed);
}
