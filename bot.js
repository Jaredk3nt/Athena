const Discord = require('discord.io');
const Request = require('request');

const auth = require('./auth.json');

const athena = new Discord.Client({
    token: auth.token,
    autorun: true
});

athena.on('ready', function(evnt) {
    console.log('Athena online.')
});

athena.on('message', (user, userID, channelID, message, evnt) => {
    if (message.substring(0,1) === '!') {
        var args = message.substring(1).split(' ');
        var command = args[0];
        args.shift();

        switch(command) {
            case 'say':
                var msg = message.substring(5);
                if(msg.length > 0) {
                    console.log('Saying: ' + msg);
                    athena.sendMessage({
                        to: channelID,
                        message: msg
                    });
                } else {
                    athena.sendMessage({
                        to: channelID,
                        message: 'You need to input something for me to say.'
                    });
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
                        var data = JSON.parse(body);
                        var msg = args[0] + ' is currently at rank **' + data.us.stats.competitive.overall_stats.comprank + '**';
                        athena.sendMessage({
                            to:channelID,
                            message: msg
                        });
                    });

                    athena.sendMessage({
                        to: channelID,
                        message: 'Let me check...'
                    });
                }

        }
    }
});
