const express     = require('express');
const app         = express();
const keepAlive   = express();
const fs          = require('fs');
const Discord     = require('discord.js');
const path        = require('path');
const client      = new Discord.Client();
const keepalive   = require('express-glitch-keepalive');
const flatten     = require('flat');
const contentful  = require('contentful-management');
let https       = require("https");

// Read & Parse json files
let jsonMessage       = fs.readFileSync('message.json');
let jsonCommand       = fs.readFileSync('command.json');
let jsonEmbed         = fs.readFileSync('embed.json');
let jsonEmbedField    = fs.readFileSync('embed_field.json');

let message           = JSON.parse(jsonMessage);
let command           = JSON.parse(jsonCommand);
let embedData         = JSON.parse(jsonEmbed);
let embedFieldData    = JSON.parse(jsonEmbedField);

let flattenCmd  = flatten({command});

keepAlive.use(keepalive);

app.use(express.static('public'));
 
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/commands', (request, response) => {
  response.sendFile(__dirname + '/views/command.html');
});

app.get('/json', function(request, response) {
  response.send(flattenCmd);
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const contentfulClient = contentful.createClient({
  accessToken: process.env.CONTENTFUL_APIKEY
})

client.on('ready', () => {
  
    client.user.setActivity('...help', {type: 'LISTENING'});
    console.log(`Logged in as ${client.user.tag}!`);  
  
    // const channel = client.channels.find(ch => ch.name === 'ellipsis');
});
var index = 0;
client.on('message', (receivedCommand) => {
  
    // Prevent bot from responding to its own messages
    if (receivedCommand.author == client.user) {
        return
    }
  
    if (receivedCommand.content.startsWith("...")) {
        processCommand(receivedCommand);
    }
       
  
    
  
  
    function processCommand(receivedCommand) {
        
        let fullCommand = receivedCommand.content.toLowerCase().substr(3) // Remove the leading prefix mark
        let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
        let primaryCommand = splitCommand[1]; // The first word after the prefix
        let secondaryCommand = splitCommand[2]; // The second word after the primary command
        let cmdArguments = splitCommand.slice(3).join(" "); // All other words are cmdArguments/parameters/options for the command

        console.log(`Full Command: ${fullCommand}`);
        console.log(`Primary Command: ${primaryCommand}`);
        console.log(`Secondary Command: ${secondaryCommand}`);
        console.log(`Arguments: ${cmdArguments}`); // There may not be any cmdArguments
                    
        if (primaryCommand == command.cmd_portalknights) {
          if (secondaryCommand == command.portalknights.type.weapon) {
            if (cmdArguments == command.portalknights.class.warrior) {

              var portalKnightsEmbed = embedData.portalknights.weapon.warrior;
              var portalKnightsFields = embedFieldData.portalknights.weapon.warrior;
              
              // Add fields into embed json
              portalKnightsEmbed.fields = portalKnightsFields.slice(0, 5);
                                  
              var embedDisplay = new Discord.RichEmbed(portalKnightsEmbed)                  
              console.log(portalKnightsEmbed.fields.length);

              receivedCommand.channel.send({embed : embedDisplay}).then(embedMessage => {
                embedMessage.react('➡️');
                embedMessage.react('⬅️');

                const filter = (reaction , user) => {
                  return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === receivedCommand.author.id;
                };

                const collector = embedMessage.createReactionCollector(filter, { time: 60000 }); // 1 min

                collector.on('collect', reaction => {
                  var i = 0

                  if (reaction.emoji.name == '➡️') {

                    // Next page button
                    var indexStart = portalKnightsEmbed.fields.length;
                    var i = 0;
                    while(i <= portalKnightsFields.length) {
                        
                        portalKnightsEmbed.fields = portalKnightsFields.slice(indexStart, i);
                        var embedDisplay = new Discord.RichEmbed(portalKnightsEmbed);
                        embedMessage.edit(embedDisplay)
                        i+=5;
                    }
                    
                  } else {
                    
                    var x = portalKnightsFields.length;
                    // Previous page button
                    while(x >= 5) {
                        
                        portalKnightsEmbed.fields = portalKnightsFields.slice(indexStart, x);
                        var embedDisplay = new Discord.RichEmbed(portalKnightsEmbed);
                        embedMessage.edit(embedDisplay)
                        x-=5;
                    }
                  }
                })                
              })
              .catch(err => console.error(err));

            }
          }
        }

    }
});

client.on('message', msg => {
  
  if ( msg.content == "what should we do now?") {
    msg.channel.send("Sleep!");
  }
  
});

client.on('message', (msg) => {
  
    if (msg.author == client.user) {
        return
    }
    
    if (msg.content.startsWith("...hd ")) {
      
      processImageCommand(msg);
    
    }
    
    function processImageCommand(msg) {
      
      let content = msg.content.toLowerCase().substr(6);      
      let hdWeaponImagePath  = __dirname +"/img_weapon/"+content+".png";
      let hdDefensiveImagePath = __dirname +"/img_stratagem/defensive/"+content+".png";
      let hdOffensiveImagePath = __dirname +"/img_stratagem/offensive/"+content+".png";
      let hdSpecialImagePath = __dirname +"/img_stratagem/special/"+content+".png";
      let hdSupplyImagePath = __dirname +"/img_stratagem/supply/"+content+".png";

      if (content) {
        
        // HD Weapon Image
        if (fs.existsSync(hdWeaponImagePath)) {
          msg.channel.send(message.helldivers.weapon[content], {files: [hdWeaponImagePath]});
        }

        // HD Defensive Stratagem Image
        if (fs.existsSync(hdDefensiveImagePath)) {
          msg.channel.send(message.helldivers.defensive[content], {files: [hdDefensiveImagePath]});
        }
        
        // HD Offensive Stratagem Image
        if (fs.existsSync(hdOffensiveImagePath)) {
          msg.channel.send(message.helldivers.offensive[content], {files: [hdOffensiveImagePath]});
        }
        
        // HD Special Stratagem Image
        if (fs.existsSync(hdSpecialImagePath)) {
          msg.channel.send(message.helldivers.special[content], {files: [hdSpecialImagePath]});
        }
        
        // HD Supply Stratagem Image
        if (fs.existsSync(hdSupplyImagePath)) {
          msg.channel.send(message.helldivers.supply[content], {files: [hdSupplyImagePath]});
        }
        
      }
    }
        
});

/*
|-----------------------------------------------------------------------------
| /help Command
|-----------------------------------------------------------------------------
*/

client.on('message', msg => {
        
    // Prevent bot from responding to its own messages
    if (msg.author == client.user) {
        return
    }

    var msgContent  = msg.content.toLowerCase();
    var prefix = "...";
    var commandList = [];
    var cmd = '';
  
    if (msgContent == prefix+command.help) {
        
        const helpCommandEmbed = new Discord.RichEmbed()
        .setColor('#fbb3ff')
        .setAuthor("Hi, I'm Ellipsis, which game content you're looking for?")
        .setDescription('Command Prefix : `...`')
        .addField('❯ HELLDIVERS™', '`hd`', true)
        .addField('❯ Portal Knights Wiki', '`pk`', true)
        .setTimestamp()
        .setFooter('Ellipsis');

        msg.channel.send(helpCommandEmbed);
    }


/*
|-----------------------------------------------------------------------------
| Helldivers Command List
|-----------------------------------------------------------------------------
*/

    if (msgContent === prefix+command.cmd_helldivers) {
        
        var offensive   = [];
        var defensive   = [];
        var supply      = [];
        var weapon      = [];
        var special     = [];
      
        for (cmd in command.helldivers.offensive) {
          offensive.push("`"+command.helldivers.offensive[cmd]+"` | ");
        }
        for (cmd in command.helldivers.defensive) {
          defensive.push("`"+command.helldivers.defensive[cmd]+"` | ");
        }
        for (cmd in command.helldivers.supply) {
          supply.push("`"+command.helldivers.supply[cmd]+"` | ");
        }
        for (cmd in command.helldivers.weapon) {
          weapon.push("`"+command.helldivers.weapon[cmd]+"` | ");
        }
        for (cmd in command.helldivers.special) {
          special.push("`"+command.helldivers.special[cmd]+"` | ");
        }
      
        const helldiversEmbed = new Discord.RichEmbed()
        .setColor('#d4d4d4')
        .setAuthor('HELLDIVERS™', 'https://steamuserimages-a.akamaihd.net/ugc/88224496145598035/E12BE9A061F526B4898A69E81B26D19148525FC3/','https://helldivers.gamepedia.com/Stratagems')
        .setDescription('Command Prefix : `...hd`')
        .setThumbnail('https://steamuserimages-a.akamaihd.net/ugc/88224496145598035/E12BE9A061F526B4898A69E81B26D19148525FC3/')
        .addField('❯ Offensive Stratagems', offensive.join(" "), true)
        .addField('❯ Defensive Stratagems', defensive.join(" "), true)
        .addField('❯ Supply Stratagems', supply.join(" "), true)
        .addField('❯ Weapons', weapon.join(" "), true)
        .addField('❯ Special Stratagems', special.join(" "), true)
        .addField('❯ Transmitter Objective Key','`trans`',true)
        .setTimestamp()
        .setFooter('Ellipsis');

        msg.channel.send(helldiversEmbed);
    }

    // Transmitter objective steps
    switch(msgContent) {
        case prefix+command.helldivers.trans : msg.channel.send(message.objective.trans_1 + 
                                                                message.objective.trans_2 + 
                                                                message.objective.trans_3 + 
                                                                message.objective.trans_4);
        break;
    }
  
/*
|-----------------------------------------------------------------------------
| Portal Knights Commands
|-----------------------------------------------------------------------------
*/
    
    if (msgContent === prefix+command.cmd_portalknights) {
        
        const helpCommandEmbed = new Discord.RichEmbed()
        .setColor('#6583fc')
        .attachFile('img_misc/portalknights.png')
        .setAuthor("Portal Knights")
        .setDescription('Command Prefix : `...pk`')
        .setThumbnail('attachment://portalknights.png')
        .addField('❯ Wiki', '`weapons` | `armor` | `blocks` | `ingredients` | `portal` | `crafting` | `tools` | `skills` | `consume` | `recipes` | `pets` | `events` | `islands` | `misc` | `bosses`', true)
        .setTimestamp()
        .setFooter('Ellipsis');

        msg.channel.send(helpCommandEmbed);
    }

    switch (msgContent) {

        case "...pk weapons"     : msg.channel.send(message.portalknights.weapons);
        break;
        case "...pk armor"       : msg.channel.send(message.portalknights.armor);
        break;
        case "...pk blocks"      : msg.channel.send(message.portalknights.blocks);
        break;
        case "...pk ingredients" : msg.channel.send(message.portalknights.ingredients);
        break;
        case "...pk portal"      : msg.channel.send(message.portalknights.portal_stones);
        break;
        case "...pk crafting"    : msg.channel.send("https://portalknights.gamepedia.com/Crafting_Stations");
        break;
        case "...pk tools"       : msg.channel.send("https://portalknights.gamepedia.com/Tools");
        break;
        case "...pk skills"      : msg.channel.send("https://portalknights.gamepedia.com/Skills");
        break;
        case "...pk consume"     : msg.channel.send("https://portalknights.gamepedia.com/Consumables");
        break;
        case "...pk misc"        : msg.channel.send("https://portalknights.gamepedia.com/Misc");
        break;
        case "...pk recipes"     : msg.channel.send("https://portalknights.gamepedia.com/Recipes");
        break;
        case "...pk pets"        : msg.channel.send("https://portalknights.gamepedia.com/Pets");
        break;
        case "...pk events"      : msg.channel.send("https://portalknights.gamepedia.com/Events");
        break;
        case "...pk islands"     : msg.channel.send("https://portalknights.gamepedia.com/Islands");
        break;
        case "...pk npc"         : msg.channel.send("https://portalknights.gamepedia.com/NPCs");
        break;
        case "...pk bosses"      : msg.channel.send("https://portalknights.gamepedia.com/Bosses");
        break;
    }
});

// Prevent from idling, send request to url every 1 minutes
setInterval(function() {
    https.get(process.env.LIVE_APP_URL);
    console.log("ping!");

}, 60 * 1000);

// Log our bot in using the token
client.login(process.env.SECRET);