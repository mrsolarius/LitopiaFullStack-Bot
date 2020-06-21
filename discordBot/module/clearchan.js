const Discord = require('discord.js');

//export des fonction
var partage = module.exports = {};
const clearChan = require('../async/clearChan');

partage.main = function (client) {
    let cptqd = client.guilds.get("319860625201168385");
    cptqd.channels.forEach(channel => {
        if(channel.name.endsWith("_temp")){
            clearChan.main(channel, '?');
        }
    })
};