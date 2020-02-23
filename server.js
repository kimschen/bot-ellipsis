const Express         = require('express');
const app             = Express();
const app_keepalive   = Express();
const keepalive       = require('express-glitch-keepalive');
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
let Help              = require('./modules/help.js');
let Helldivers        = require('./modules/helldivers.js');
let PortalKnights     = require('./modules/portalknights.js');

app_keepalive.use(keepalive);

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



bot.on('message', async message => {
  
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  
  let fullCmd      = message.content.toLowerCase().substr(3).trim(); // Remove the prefix
  let splitCmd     = fullCmd.split(" "); // Split the message to pieces for each space
  let primaryCmd   = splitCmd[0]; // The first word after the prefix
  let secondaryCmd = splitCmd[1]; // The second word after the primary command
  let args         = splitCmd.slice(2).join(" "); // All other words are args/parameters/options for the command
  
  console.log(`full: ${fullCmd}`);
  console.log(`primary : ${primaryCmd}`);
  console.log(`secondary : ${secondaryCmd}`);
  console.log(`args : ${args}`);
  
  if (message.content.startsWith(command.prefix)) {
    
    if (primaryCmd === command.cmd_portalknights) {
      
      PortalKnights.run(message, secondaryCmd, args);
      
    }
    
    if (primaryCmd === command.cmd_helldivers) {
        Helldivers.run(message, secondaryCmd);
    }
      
    if (primaryCmd === command.cmd_helldivers) {
      if (secondaryCmd == null) {
          
        Helldivers.list(message);
          
      }
    }
    
    if (primaryCmd === command.help) {
      Help.run(message);
    }
    
  }
});

/*
|-----------------------------------------------------------------------------
| Portal Knights Commands
|-----------------------------------------------------------------------------
*/
    
//     if (msgContent === command.prefix+command.cmd_portalknights) {
        
//         const helpCommandEmbed = new Discord.RichEmbed()
//         .setColor('#6583fc')
//         .attachFile('img_misc/portal_knights.png')
//         .setAuthor("Portal Knights")
//         .setDescription('Command Prefix : `... pk`')
//         .setThumbnail('attachment://portal_knights.png')
//         .addField('❯ Wiki', '`weapons` | `armor` | `blocks` | `ingredients` | `portal` | `crafting` | `tools` | `skills` | `consume` | `recipes` | `pets` | `events` | `islands` | `misc` | `bosses`', true)
//         .setTimestamp()
//         .setFooter('Ellipsis');

//         msg.channel.send(helpCommandEmbed);
//     }

//     switch (msgContent) {

//         case "... pk weapons"     : msg.channel.send(message.portalknights.weapons);
//         break;
//         case "... pk armor"       : msg.channel.send(message.portalknights.armor);
//         break;
//         case "... pk blocks"      : msg.channel.send(message.portalknights.blocks);
//         break;
//         case "... pk ingredients" : msg.channel.send(message.portalknights.ingredients);
//         break;
//         case "... pk portal"      : msg.channel.send(message.portalknights.portal_stones);
//         break;
//         case "... pk crafting"    : msg.channel.send("https://portalknights.gamepedia.com/Crafting_Stations");
//         break;
//         case "... pk tools"       : msg.channel.send("https://portalknights.gamepedia.com/Tools");
//         break;
//         case "... pk skills"      : msg.channel.send("https://portalknights.gamepedia.com/Skills");
//         break;
//         case "... pk consume"     : msg.channel.send("https://portalknights.gamepedia.com/Consumables");
//         break;
//         case "... pk misc"        : msg.channel.send("https://portalknights.gamepedia.com/Misc");
//         break;
//         case "... pk recipes"     : msg.channel.send("https://portalknights.gamepedia.com/Recipes");
//         break;
//         case "... pk pets"        : msg.channel.send("https://portalknights.gamepedia.com/Pets");
//         break;
//         case "... pk events"      : msg.channel.send("https://portalknights.gamepedia.com/Events");
//         break;
//         case "... pk islands"     : msg.channel.send("https://portalknights.gamepedia.com/Islands");
//         break;
//         case "... pk npc"         : msg.channel.send("https://portalknights.gamepedia.com/NPCs");
//         break;
//         case "... pk bosses"      : msg.channel.send("https://portalknights.gamepedia.com/Bosses");
//         break;
//     }

// Prevent from idling, send request to url every 1 minutes
setInterval(function() {
    https.get(process.env.LIVE_APP_URL);
    console.log("ping!");

}, 60 * 1000);

// Log our bot in using the token
bot.login(process.env.SECRET);