module.exports.cntPortalKnights = function (receivedCommand, DISCORD, embed, embedFields) {

  // Add fields into embed json
  embed.fields = embedFields.slice(0, 5);

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
        console.log(`index list ${indexList}`);

        embed.fields = embedFields.slice(indexList+1,indexList+6);

//                         if (indexList > 19) {

//                           console.log("index -1 true");
//                           embed.fields = embedFields.slice(0,5);
//                           let embedDisplay = new DISCORD.RichEmbed(embed);
//                           embedMessage.edit(embedDisplay)

//                         } 

          let embedDisplay = new DISCORD.RichEmbed(embed);
          embedMessage.edit(embedDisplay)


          console.log(`index of ${embedFields.indexOf(embed.fields[4])}`);
          console.log("end");


      } else {

          let indexList = embedFields.indexOf(embed.fields[4]);
          console.log(`index list ${indexList}`);

          embed.fields = embedFields.slice(indexList-9,indexList-4);

          if (indexList == -1) {

            console.log("index -1 true");
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
