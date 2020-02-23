'use strict'
/*
|------------------------------------------------------------------------------------
| This module is exporting function as a class to display game contents in RichEmbed
|------------------------------------------------------------------------------------
*/
const Discord         = require('discord.js');
const cmd             = require("../commands/portalknights.json");
const embedData       = require("../embed.json");
const embedFieldData  = require("../embed_fields/portalknights.json");

module.exports.run = async (message, secondaryCmd, args) => {
  
    this.secondaryCmd = secondaryCmd;
    this.args = args;

    let embed = embedData.portalknights[this.secondaryCmd][this.args];
    let embedFields = embedFieldData[this.secondaryCmd][this.args];          

    embed.fields = embedFields.slice(0, 5); // Set the embed fields data from 0 - 5
    let embedDisplay = new Discord.RichEmbed(embed); // Create an embed object with embed data               

    message.channel.send({embed : embedDisplay}).then(async embedMessage => {
      await embedMessage.react('⬅️');
      await embedMessage.react('➡️');

      const filter = (reaction , user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      const collector = embedMessage.createReactionCollector(filter, { time: 60000 * 5}); // 1 min

      collector.on('collect', reaction => {

        // Next page button                        
        if (reaction.emoji.name == '➡️') {

          let indexList = embedFields.indexOf(embed.fields[4]);
          embed.fields = embedFields.slice(indexList+1,indexList+6);

          if (indexList == -1) {

            embed.fields = embedFields.slice(0,5);
            let embedDisplay = new Discord.RichEmbed(embed);
            embedMessage.edit(embedDisplay)

          } 

          let embedDisplay = new Discord.RichEmbed(embed);
          embedMessage.edit(embedDisplay)


        } else {

            let indexList = embedFields.indexOf(embed.fields[4]);
            embed.fields = embedFields.slice(indexList-9,indexList-4);

            if (indexList <= 4) {

              embed.fields = embedFields.slice(0,5);
              let embedDisplay = new Discord.RichEmbed(embed);
              embedMessage.edit(embedDisplay)

            } 

            let embedDisplay = new Discord.RichEmbed(embed);
            embedMessage.edit(embedDisplay)

        }
      })                
    })
    .catch(err => console.error(err));
}
