const Discord = require('discord.js');
const Request = require('request');
const Utils = require('../utils');

module.exports = {
    run: function(athena, message, args) {
        if(args[0] !== undefined && args[1] !== undefined) {
            var options = {
                url: 'http://owapi.net/api/v3/u/' + args[1] + '/heroes',
                method: 'GET',
                headers: { 'User-Agent': 'athena-app'}
            };

            Request(options, function(error, response, body) {
                let data = JSON.parse(body);
                if(data.error === undefined) {
                    let hero = data.us.heroes.stats.competitive[args[0].toLowerCase()];
                    console.log(hero);
                    message.channel.send('Stats for ' + Utils.capitalize(args[0]) + ': ' + hero.general_stats.win_percentage);
                } else {
                    message.channel.send('Sorry I could not find that hero.');
                }
            });
        } else {
            message.channel.send('Usage: !hero junkrat user-1234');
        }
    }
}
