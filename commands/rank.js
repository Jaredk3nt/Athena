const Discord = require('discord.js');
const Request = require('request');
const Utils = require('../utils');

module.exports = {
    run: function(athena, message, args) {
        if(args[0] !== undefined) {
            var options = {
                url: 'http://owapi.net/api/v3/u/' + args[0] + '/stats',
                method: 'GET',
                headers: { 'User-Agent': 'athena-app'}
            };
            message.channel.send('Let me check...');
            Request(options, function(error, response, body) {
                let data = JSON.parse(body);
                if(data.error === undefined) {
                    let level = (data.us.stats.quickplay.overall_stats.prestige * 100) + data.us.stats.quickplay.overall_stats.level;
                    let msg = new Discord.RichEmbed({})
                        .setColor(16358938)
                        .setTitle(args[0])
                        .setDescription(Utils.capitalize(data.us.stats.competitive.overall_stats.tier) + ' - **' + data.us.stats.competitive.overall_stats.comprank + '** SR');
                    message.channel.send({ embed: msg});
                } else {
                    message.channel.send('Sorry, I couldn\'t find that user. Be careful battletags are **case sensitive**');
                }

            });
        } else {
            message.channel.send('usage: `!rank battletag-1234`');
        }
    }
}
