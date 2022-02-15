require('dotenv').config();

const web3 = require('web3');

const Discord = require('discord.js');
const {Intents, MessageEmbed} = require("discord.js");

const bot = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

let logChannel = null;

bot.on('ready', () => {
    console.log("Bot is ready");

    logChannel = bot.channels.cache.get(process.env.CHANNEL_ID);
})

bot.login(process.env.BOT_KEY).then((result, error) => {
    if(error) console.log(error);

    console.log("Bot is now logged in");
});

bot.on('messageCreate', async (message) => {

    const channel = await bot.channels.fetch(message.channelId);
    const channel_name = channel.name;
    let text = message.content;

    if(text.startsWith("!gas") && channel_name === 'gas-estimates') {

        const args = text.split(" ");

        if(args.length < 3) return;

        const gas_limit = args[1];
        const price = args[2];

        let embed_message = `**Gas Limit:** ${gas_limit} | **Price:** ${price}\n\n`;

        for(let i = 1; i < 51; i++) {

            const gwei_cost = (i * 200) * Number.parseInt(gas_limit);
            const wei = web3.utils.toWei(`${gwei_cost}`, 'gwei');
            const gas_price = web3.utils.fromWei(wei, 'ether');
            const total_price = Number.parseFloat(`${Number.parseFloat(gas_price) + Number.parseFloat(price)}`).toFixed(4) ;
            embed_message += `**${i * 200}** Max Gas GWEI | **${total_price}** ETH\n`


        }

        const embed = new MessageEmbed()
            .setColor('#34eb92')
            .setTitle('Gas Calculator')
            .setDescription(embed_message);

        (await bot.channels.fetch(channel.id)).send({embeds: [embed]});
    }

    // console.log("Received message", message.content, channel.name);
})