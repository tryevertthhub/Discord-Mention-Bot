const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
const { fetchAIResponse } = require('./openRouterService');
const config = require('./config.json');
const OpenRouter = require('./Router/openrouter');

/**
 * Sends an initial button to the user to trigger the AI prompt modal.
 * @param {Object} interaction - Discord interaction object.
 */
async function sendAskModal(interaction) {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('openModal')
                .setLabel('Ask the AI')
                .setStyle(ButtonStyle.Primary)
        );
    await interaction.reply({ content: 'Click the button to ask the AI:', components: [row], ephemeral: true });
}

/**
 * Presents a modal to the user to input their question for the AI.
 * @param {Object} interaction - Discord interaction object.
 */
async function showAskModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('aiModal')
        .setTitle('Ask the AI');

    const messageInput = new TextInputBuilder()
        .setCustomId('messageInput')
        .setLabel('What would you like to ask the AI?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(messageInput);
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
}

/**
 * Main function to handle various interactions.
 * @param {Object} interaction - Discord interaction object.
 * @param {Object} client - Discord client instance.
 */
async function handleInteraction(interaction, client) {
    if (interaction.isCommand() && interaction.commandName === 'ask') {
        await sendAskModal(interaction);
    }
    if (interaction.isButton() && interaction.customId === 'openModal') {
        await showAskModal(interaction);
    }
    if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'aiModal') {
        await processAskModal(interaction);
    }
    if (interaction.isButton() && interaction.customId === 'deleteMessage') {
        await deleteMessage(interaction);
    }
    if (interaction.isButton() && interaction.customId.startsWith('relatedQuestion')) {
        await handleRelatedQuestion(interaction);
    }
}

/**
 * Processes the user’s question from the modal and sends an AI response.
 * @param {Object} interaction - Discord interaction object.
 */
async function processAskModal(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const userMessage = interaction.fields.getTextInputValue('messageInput');
    const router = new OpenRouter(config.OPEN_ROUTER_API_KEY);

    const response = await router.generate(userMessage);

    const deleteButton = new ButtonBuilder()
        .setCustomId('deleteMessage')
        .setLabel('Delete')
        .setStyle(ButtonStyle.Danger);

    const actionRows = [new ActionRowBuilder().addComponents(deleteButton)];

    if (response.length > 2000) {
        const responseChunks = response.match(/.{1,2000}/g);
        try {
            await interaction.editReply({
                content: responseChunks[0],
                components: actionRows,
                ephemeral: true,
            });
            for (let i = 1; i < responseChunks.length; i++) {
                await interaction.followUp({ content: responseChunks[i], ephemeral: true });
            }
        } catch (error) {
            console.error('Failed to send the response chunks:', error);
        }
    } else {
        try {
            await interaction.editReply({
                content: `Response from OpenRouter: ${response}`,
                components: actionRows,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Failed to send the response:', error);
        }
    }
}

/**
 * Fetches the response for a related question and sends it to the user.
 * @param {Object} interaction - Discord interaction object.
 */
async function handleRelatedQuestion(interaction) {
    try {
        await interaction.deferUpdate();
        const selectedQuestion = interaction.component.label;
        const relatedAnswer = await fetchAIResponse(selectedQuestion);

        if (relatedAnswer.length > 2000) {
            const responseChunks = relatedAnswer.match(/.{1,2000}/g);
            await interaction.followUp({ content: responseChunks[0], ephemeral: true });
            for (let i = 1; i < responseChunks.length; i++) {
                await interaction.followUp({ content: responseChunks[i], ephemeral: true });
            }
        } else {
            await interaction.followUp({ content: `Response: ${relatedAnswer}`, ephemeral: true });
        }
    } catch (error) {
        console.error('Error while handling related question:', error);
    }
}

/**
 * Deletes a message at the user's request.
 * @param {Object} interaction - Discord interaction object.
 */
async function deleteMessage(interaction) {
    await interaction.message.delete();
    await interaction.reply({ content: 'Message deleted!', ephemeral: true });
}

module.exports = { handleInteraction };
