const EXPRESS         = require('express');
const APP             = EXPRESS();
const APP_KEEP_ALIVE  = EXPRESS();
const KEEP_ALIVE      = require('express-glitch-keepalive');
const FILE_SYSTEM     = require('fs');
const DISCORD         = require('discord.js');
const FLAT            = require('flat');
const CONTENTFUL      = require('contentful-management');
const HTTPS           = require("https");
const BOT             = new DISCORD.Client();

// Read & Parse json files
let jsonMessage       = FILE_SYSTEM.readFileSync('message.json');
let jsonCommand       = FILE_SYSTEM.readFileSync('command.json');
let jsonEmbed         = FILE_SYSTEM.readFileSync('embed.json');
let jsonEmbedField    = FILE_SYSTEM.readFileSync('embed_field.json');
let message           = JSON.parse(jsonMessage);
let command           = JSON.parse(jsonCommand);
let embedData         = JSON.parse(jsonEmbed);
let embedFieldData    = JSON.parse(jsonEmbedField);
let flattenCmd        = FLAT({command});

// Import Modules
let Helldivers        = require('./contents/helldivers.js');
let PortalKnights     = require('./contents/portalknights.js');

APP_KEEP_ALIVE.use(KEEP_ALIVE);

APP.use(EXPRESS.static('public'));
 
APP.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

APP.get('/commands', (request, response) => {
  response.sendFile(__dirname + '/views/command.html');
});

APP.get('/json', function(request, response) {
  response.send(flattenCmd);
});

const LISTENER = APP.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + LISTENER.address().port);
});

const CLIENT_CONTENTFUL = CONTENTFUL.createClient({
  accessToken: process.env.CONTENTFUL_APIKEY
})

BOT.on('ready', () => {
  
    BOT.user.setActivity('... help', {type: 'LISTENING'});
    console.log(`Logged in as ${BOT.user.tag}!`);  
  
    // const channel = BOT.channels.find(ch => ch.name === 'ellipsis');
});


BOT.on('message', (receivedCommand) => {
  
    
    // Prevent bot from responding to its own messages
    if (receivedCommand.author == BOT.user) {
        return
    }
  
    if (receivedCommand.content.startsWith(command.prefix)) {
      
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
             
        // Portal Knights
        if (primaryCommand == command.cmd_portalknights) {
          if (secondaryCommand == command.portalknights.type.weapon) {
            if (cmdArguments == command.portalknights.class.warrior) {

              let portalKnightsEmbed = embedData.portalknights.weapon.warrior;
              let portalKnightsFields = embedFieldData.portalknights.weapon.warrior;
              
              PortalKnights.cntPortalKnights(receivedCommand, DISCORD, portalKnightsEmbed, portalKnightsFields);

            }
          }
        }
      
      // Helldivers
      if (primaryCommand == command.cmd_helldivers) {
        Helldivers.cntHelldivers(receivedCommand, FILE_SYSTEM, message);
      }
      
      if (primaryCommand == command.cmd_helldivers) {
        if (secondaryCommand == null) {
          Helldivers.cntEmbedCommand(receivedCommand, DISCORD, command);
        }
      }

    }
});

/*
|-----------------------------------------------------------------------------
| /help Command
|-----------------------------------------------------------------------------
*/

BOT.on('message', msg => {
        
    // Prevent bot from responding to its own messages
    if (msg.author == BOT.user) {
        return
    }

    let msgContent  = msg.content.toLowerCase();
  
    if (msgContent == command.prefix+command.help) {
        
        const helpCommandEmbed = new DISCORD.RichEmbed()
        .setColor('#fbb3ff')
        .setAuthor("Hi, I'm Ellipsis, which game content you're looking for?")
        .setDescription('Command Prefix : `...`')
        .addField('❯ HELLDIVERS™', '`hd`', true)
        .addField('❯ Portal Knights', '`pk`', true)
        .setTimestamp()
        .setFooter('Ellipsis');

        msg.channel.send(helpCommandEmbed);
    }

    // Transmitter objective steps
    switch(msgContent) {
        case command.prefix+command.helldivers.trans : msg.channel.send(message.objective.trans_1 + 
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
    
    if (msgContent === command.prefix+command.cmd_portalknights) {
        
        const helpCommandEmbed = new DISCORD.RichEmbed()
        .setColor('#6583fc')
        .attachFile('img_misc/portal_knights.png')
        .setAuthor("Portal Knights")
        .setDescription('Command Prefix : `... pk`')
        .setThumbnail('attachment://portal_knights.png')
        .addField('❯ Wiki', '`weapons` | `armor` | `blocks` | `ingredients` | `portal` | `crafting` | `tools` | `skills` | `consume` | `recipes` | `pets` | `events` | `islands` | `misc` | `bosses`', true)
        .setTimestamp()
        .setFooter('Ellipsis');

        msg.channel.send(helpCommandEmbed);
    }

    switch (msgContent) {

        case "... pk weapons"     : msg.channel.send(message.portalknights.weapons);
        break;
        case "... pk armor"       : msg.channel.send(message.portalknights.armor);
        break;
        case "... pk blocks"      : msg.channel.send(message.portalknights.blocks);
        break;
        case "... pk ingredients" : msg.channel.send(message.portalknights.ingredients);
        break;
        case "... pk portal"      : msg.channel.send(message.portalknights.portal_stones);
        break;
        case "... pk crafting"    : msg.channel.send("https://portalknights.gamepedia.com/Crafting_Stations");
        break;
        case "... pk tools"       : msg.channel.send("https://portalknights.gamepedia.com/Tools");
        break;
        case "... pk skills"      : msg.channel.send("https://portalknights.gamepedia.com/Skills");
        break;
        case "... pk consume"     : msg.channel.send("https://portalknights.gamepedia.com/Consumables");
        break;
        case "... pk misc"        : msg.channel.send("https://portalknights.gamepedia.com/Misc");
        break;
        case "... pk recipes"     : msg.channel.send("https://portalknights.gamepedia.com/Recipes");
        break;
        case "... pk pets"        : msg.channel.send("https://portalknights.gamepedia.com/Pets");
        break;
        case "... pk events"      : msg.channel.send("https://portalknights.gamepedia.com/Events");
        break;
        case "... pk islands"     : msg.channel.send("https://portalknights.gamepedia.com/Islands");
        break;
        case "... pk npc"         : msg.channel.send("https://portalknights.gamepedia.com/NPCs");
        break;
        case "... pk bosses"      : msg.channel.send("https://portalknights.gamepedia.com/Bosses");
        break;
    }
});

// Prevent from idling, send request to url every 1 minutes
setInterval(function() {
    HTTPS.get(process.env.LIVE_APP_URL);
    console.log("ping!");

}, 60 * 1000);

// Log our bot in using the token
BOT.login(process.env.SECRET);