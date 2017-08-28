const Request = require('request');
const Utils = require('../utils');

module.exports = {
    run: function(athena, message, args) {
        if(args[0] !== null) {
            var options = {
                url: 'http://owapi.net/api/v3/u/' + args[0] + '/blob',
                method: 'GET',
                headers: { 'User-Agent': 'athena-app'}
            };

            Request(options, function(error, response, body) {
                let data = JSON.parse(body);
                if(data.error === undefined) {
                    let statObj = data.us.stats.competitive.overall_stats;
                    let level = (statObj.prestige * 100) + statObj.level;
                    let heroes = getTopHeroes(data.us.heroes);
                    let msg = { embed: {
                        color:  16358938,
                        author: {
                            name: args[0],
                            //icon_url: data.us.stats.quickplay.overall_stats.avatar
                        },
                        description: 'lv. ' + level + ' | ' + Utils.capitalize(statObj.tier) + ' - **' + statObj.comprank + '** SR',
                        thumbnail: {
                            url: statObj.avatar
                        },
                        fields: [
                            {
                                name: 'Winrate',
                                value: '**' + statObj.win_rate + '%** ' + '(' + statObj.wins + '-' + statObj.losses + '-' + statObj.ties + ')'
                            },
                            {
                                name: 'Heroes',
                                value: heroes
                            }
                        ]
                    }}
                    message.channel.send(msg);
                } else {
                    message.channel.send('Sorry, I couldn\'t find that user. Be careful battletags are **case sensitive**');
                }
            });
            message.channel.send('Let me check...');
        }
    }
}

/* See if a hero should be inserted to the array of top heroes */
var insertHero = function(heroArray, key, value) {
    let hero = { name: key, playtime: value };
    if(heroArray.length === 0) {
        heroArray.push(hero);
    } else {
        for(var i = 0; i < heroArray.length; i++) {
            let current = heroArray[i];
            // If the new hero has a higher play time, place it in front
            if(hero.playtime > current.playtime) {
                heroArray.splice(i, 0, hero);
                //Don't allow the list to become longer than 5 heroes
                if(heroArray.length > 5) {
                    heroArray.pop();
                }
                break;
            }
        }
        if(heroArray.length < 5) {
            heroArray.push(hero);
        }
    }
    return heroArray;
};

/* Get a string for the top 5 heroes for a player */
var getTopHeroes = function(heroes) {
    let heroArray = [];
    // Create an array of the top 5 heroes for a player
    for(var key in heroes.playtime.competitive) {
        if(heroes.playtime.competitive.hasOwnProperty(key)) {
            heroArray = insertHero(heroArray, key, heroes.playtime.competitive[key]);
        }
    }
    // Create the string for the display message
    let topHeroes = '';
    for(hero of heroArray) {
        topHeroes += '**' + Utils.capitalize(hero.name) + '**\n';
        topHeroes += hero.playtime + ' hours\t';
        topHeroes += '**' + (heroes.stats.competitive[hero.name].general_stats.win_percentage * 100) + '%** winrate\n---\n';
    }

    return topHeroes;
};
