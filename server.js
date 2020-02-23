const Express         = require('express');
const app             = Express();
const app_keep_alive  = Express();
const keep_alive      = require('express-glitch-keepalive');
const https           = require("https");
const Discord         = require('discord.js');
const bot             = new Discord.Client();
const flat            = require('flat');
const Contentful      = require('contentful-management');

// json files
const command         = require("./command.json");
const message         = require("./message.json");
const embedData       = require("./embed.json");
const embedFieldData  = require("./embed_fields/portalknights.json");
const flattenCmd      = flat({command});

// Import Modules
let Helldivers        = require('./modules/helldivers.js');
let PortalKnights     = require('./modules/portalknights.js');

app_keep_alive.use(keep_alive);

app.use(Express.static('public'));
 
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/commands', (request, response) => {
  response.sendFile(__dirname + '/views/command.html');
});

app.get('/json', function(request, response) {
  response.send(flattenCmd);
});

const LISTENER = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + LISTENER.address().port);
});

const client_contentful = Contentful.createClient({
  accessToken: process.env.CONTENTFUL_APIKEY
})

bot.on('ready', () => {
  
    bot.user.setActivity('... help', {type: 'LISTENING'});
    console.log(`Logged in as ${bot.user.tag}!`);  
  
    // const channel = bot.channels.find(ch => ch.name === 'ellipsis');
});


bot.on('message', (receivedCommand) => {
  
    
    // Prevent bot from responding to its own messages
    if (receivedCommand.author == bot.user) {
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
              // let portalKnightsFields = embedFieldData.weapon.warrior;
              portalKnightsEmbed.fields = embedFieldData.weapon.warrior;
              
              PortalKnights.CNT_PortalKnights(receivedCommand, portalKnightsEmbed);

            }
          }
        }
      
      // Helldivers
      if (primaryCommand == command.cmd_helldivers) {
        Helldivers.cntHelldivers(receivedCommand, message);
      }
      
      if (primaryCommand == command.cmd_helldivers) {
        if (secondaryCommand == null) {
          
          let helldiversEmbed = embedData.helldivers.help;

          Helldivers.cntEmbedCommand(receivedCommand, command, helldiversEmbed);
          
        }
      }

    }
});

/*
|-----------------------------------------------------------------------------
| /help Command
|-----------------------------------------------------------------------------
*/

bot.on('message', msg => {
        
    // Prevent bot from responding to its own messages
    if (msg.author == bot.user) {
        return
    }

    let msgContent  = msg.content.toLowerCase();
  
    if (msgContent == command.prefix+command.help) {
        
        const helpCommandEmbed = new Discord.RichEmbed()
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
        
        const helpCommandEmbed = new Discord.RichEmbed()
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
    https.get(process.env.LIVE_APP_URL);
    console.log("ping!");

}, 60 * 1000);

// Log our bot in using the token
bot.login(process.env.SECRET);