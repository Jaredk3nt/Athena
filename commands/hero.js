const Discord = require('discord.js');
const Request = require('request');
const Utils = require('../utils');

module.exports = {
    run: function(athena, message, args) {
        if(args[0] !== undefined && args[1] !== undefined) {
            var options = {
                url: 'http://owapi.net/api/v3/u/' + args[1] + '/blob',
                method: 'GET',
                headers: { 'User-Agent': 'athena-app'}
            };
            message.channel.send('Let me check...');
            Request(options, function(error, response, body) {
                let data = JSON.parse(body);
                if(data.error === undefined) {
                    let hero = data.us.heroes.stats.competitive[args[0].toLowerCase()];
                    let totalGames = hero.general_stats.games_played;
                    let playtime = hero.general_stats.time_played < 1.0 ? hero.general_stats.time_played.toFixed(2) : hero.general_stats.time_played.toFixed(0);
                    let msg = new Discord.RichEmbed({})
                        .setAuthor(args[1], data.us.stats.competitive.overall_stats.avatar)
                        .setTitle(Utils.capitalize(args[0]))
                        .setDescription(playtime + ' hours')
                        //.setThumbnail(data.us.stats.competitive.overall_stats.avatar)
                        .addField('Winrate',  (hero.general_stats.win_percentage*100).toFixed(0) + '% ' + '(' + hero.general_stats.games_won + '-' + hero.general_stats.games_lost + ')', true)
                        .addField('Accuracy', (hero.general_stats.weapon_accuracy * 100).toFixed(0) + '%', true)
                        .addField('Average Medals', '🥇' + (hero.general_stats.medals_gold/totalGames).toFixed(2) + ' 🥈' + (hero.general_stats.medals_silver/totalGames).toFixed(2) + ' 🥉' + (hero.general_stats.medals_bronze/totalGames).toFixed(2), false)
                        .addField('Eliminations', (hero.general_stats.eliminations/totalGames).toFixed(1), true)
                        .addField('Obj Kills', (hero.general_stats.objective_kills/totalGames).toFixed(1), true)
                        .addField('Obj Time', ((hero.general_stats.objective_time*60)/totalGames).toFixed(1) + ' min', true)
                        .addField('Damage', (hero.general_stats.all_damage_done/totalGames).toFixed(1), true)
                        .addField('Healing', (hero.general_stats.healing_done/totalGames).toFixed(1), true)
                        .addField('Deaths', (hero.general_stats.deaths/totalGames).toFixed(1), true)
                        ;

                    message.channel.send({ embed: msg });
                } else {
                    message.channel.send('Sorry I could not find that hero.');
                }
            });
        } else {
            message.channel.send('Usage: `!hero junkrat user-1234`');
        }
    }
}
