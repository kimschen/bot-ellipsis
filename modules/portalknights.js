'use strict'

/*
|------------------------------------------------------------------------------------
| This module is exporting function as a class to display game contents in RichEmbed
|------------------------------------------------------------------------------------
*/

const DISCORD = require('discord.js');

module.exports.CNT_PortalKnights = function (receivedCommand, embed) {

  // Declare a let variable to store all embed fields data
  let embedFields = embed.fields;
  
  // Set the embed fields data from 0 - 5
  embed.fields = embedFields.slice(0, 5);

  // Create an embed object with embed data
  let embedDisplay = new DISCORD.RichEmbed(embed)                  

  receivedCommand.channel.send({embed : embedDisplay}).then(embedMessage => {
    embedMessage.react('➡️');
    embedMessage.react('⬅️');

    const filter = (reaction , user) => {
      return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === receivedCommand.author.id;
    };

    const collector = embedMessage.createReactionCollector(filter, { time: 60000 * 5}); // 1 min

    collector.on('collect', reaction => {

      // Next page button                        
      if (reaction.emoji.name == '➡️') {
        
        let indexList = embedFields.indexOf(embed.fields[4]);
        embed.fields = embedFields.slice(indexList+1,indexList+6);

        if (indexList == -1) {

          embed.fields = embedFields.slice(0,5);
          let embedDisplay = new DISCORD.RichEmbed(embed);
          embedMessage.edit(embedDisplay)

        } 

        let embedDisplay = new DISCORD.RichEmbed(embed);
        embedMessage.edit(embedDisplay)


      } else {

          let indexList = embedFields.indexOf(embed.fields[4]);
          embed.fields = embedFields.slice(indexList-9,indexList-4);

          if (indexList <= 4) {

            embed.fields = embedFields.slice(0,5);
            let embedDisplay = new DISCORD.RichEmbed(embed);
            embedMessage.edit(embedDisplay)

          } 

          let embedDisplay = new DISCORD.RichEmbed(embed);
          embedMessage.edit(embedDisplay)

      }
    })                
  })
  .catch(err => console.error(err));


}
