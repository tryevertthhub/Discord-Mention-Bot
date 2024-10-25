const { Client, GatewayIntentBits, REST, Routes, Events } = require('discord.js');
const emoji = require('node-emoji');
const path = require('path');
const config = require('./config.json');


// Import Handlers
const { handleInteraction } = require('./commandHandler');

// Initialize Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', async () => {
    const chalk = (await import('chalk')).default;
    console.log(chalk.green(`Logged in as ${client.user.tag}!`) + ' ' + emoji.get('white_check_mark'));
});

// Register commands
const commands = [
    {
        name: 'ask',
        description: 'Ask a question to the AI',
    },
];

const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

(async () => {
    const chalk = (await import('chalk')).default;
    try {
        console.log(chalk.blue('Started refreshing application (/) commands.'));
        await rest.put(Routes.applicationCommands(config.CLIENT_ID), { body: commands });
        console.log(chalk.green('Successfully reloaded application (/) commands.'));
    } catch (error) {
        console.error(chalk.red('Failed to register commands:'), error);
    }
})();

// Handle interaction events
client.on(Events.InteractionCreate, (interaction) => handleInteraction(interaction, client));

 // Log in to Discord
 (async () => {
    const chalk = (await import('chalk')).default;

    client.login(config.BOT_TOKEN)
        .then(() => {
            console.log(chalk.green('Bot logged in successfully') + ' ' + emoji.get('white_check_mark'));
        })
        .catch((error) => {
            console.error(chalk.red('Failed to log in:') + ' ' + emoji.get('x'), error);
        });
})();
