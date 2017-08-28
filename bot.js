const Discord = require('discord.js');
const Request = require('request');
const Utils = require('./utils');

const Rank = require('./commands/rank');
const Stats = require('./commands/stats');
const Hero = require('./commands/hero');

const auth = require('./auth.json');

const athena = new Discord.Client();

athena.on('ready', function(evnt) {
    console.log('Athena online.')
});

athena.on('message', (message) => {
    if (message.content.startsWith('!')) {
        const args = message.content.slice(1).split(/\s+/g);
        let command = args.shift();

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
                Rank.run(athena, message, args);
                break;
            case 'stats':
                Stats.run(athena, message, args);
                break;
            case 'hero':
                Hero.run(athena, message, args);
                break;
        }
    }
});

athena.login(auth.token);
