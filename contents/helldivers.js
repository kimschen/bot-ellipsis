module.exports.processImageCommand = function (fs, message, receivedCommand) {

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
