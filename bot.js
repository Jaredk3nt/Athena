const Discord = require('discord.js');
const Request = require('request');
const Utils = require('./utils');

const Stats = require('./commands/stats');

const auth = require('./auth.json');

const athena = new Discord.Client();

athena.on('ready', function(evnt) {
    console.log('Athena online.')
});

athena.on('message', (message) => {
    if (message.content.startsWith('!')) {
        const args = message.content.slice(1).split(/\s+/g);
        let command = args[0];
        args.shift();

        switch(command) {
            case 'say':
                var msg = message.content.slice(5);
                if(msg.length > 0) {
                    message.channel.send(msg);
                } else {
                    message.channel.send('You need to input something for me to say.');
                }
                break;
            case 'rank':
                if(args[0] !== null) {
                    var options = {
                        url: 'http://owapi.net/api/v3/u/' + args[0] + '/stats',
                        method: 'GET',
                        headers: { 'User-Agent': 'athena-app'}
                    };

                    Request(options, function(error, response, body) {
                        let data = JSON.parse(body);
                        //console.log(data.error);
                        if(data.error === undefined) {
                            //console.log(data);
                            let level = (data.us.stats.quickplay.overall_stats.prestige * 100) + data.us.stats.quickplay.overall_stats.level;
                            let msg = { embed: {
                                color:  16358938,
                                author: {
                                    name: args[0],
                                },
                                description: Utils.capitalize(data.us.stats.competitive.overall_stats.tier) + ' - **' + data.us.stats.competitive.overall_stats.comprank + '** SR',
                            }}
                            message.channel.send(msg);
                        } else {
                            message.channel.send('Sorry, I couldn\'t find that user. Be careful battletags are **case sensitive**');
                        }

                    });
                    message.channel.send('Let me check...');
                }
                break;
            case 'stats':
                Stats.run(athena, message, args);
                break;
        }
    }
});

athena.login(auth.token);
