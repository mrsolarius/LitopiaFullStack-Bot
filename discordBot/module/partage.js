const Discord = require('discord.js');

//export des fonction
var partage = module.exports = {};

partage.main = async function (leChannel, username) {
    var interval = setInterval (function () {
            if(leChannel.members.array().length == 0){
                leChannel.delete();
                console.log('Channel de '+username+' supprimé.'+'\n----------------------------------------');
                clearInterval(interval);
            }
    }, 5000);
    return;
};