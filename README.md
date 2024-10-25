# Discord AI Chat Bot

This Discord bot leverages OpenRouter's API to provide AI-driven responses, allowing users to ask questions and receive intelligent replies directly within Discord.

## Features

- **Slash Command Interaction**: Use `/ask` to trigger an AI response.
- **Dynamic Suggestions**: Provides related questions to keep the conversation engaging.
- **Ephemeral Responses**: Private replies, only visible to the user who asked.
- **Message Controls**: Easily delete bot messages for privacy.

## Prerequisites

- **Node.js** v16+ (for Discord.js compatibility)
- **Discord Bot Token**
- **OpenRouter API Key**

## Installation

1. **Clone this repository**:
    ```bash
   https://github.com/tryevertthhub/Discord-Mention-Bot.git
    cd Discord-Mention-Bot
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure**:
   Create a `config.json` file in the root directory:
    ```json
    {
      "BOT_TOKEN": "YOUR_DISCORD_BOT_TOKEN",
      "OPEN_ROUTER_API_KEY": "YOUR_OPENROUTER_API_KEY"
    }
    ```

## Usage

1. **Start the bot**:
    ```bash
    node bot.js
    ```
2. **Interact on Discord**:
    Type `/ask` to begin a conversation.

## Project Structure

- **bot.js** - Main entry point.
- **commandHandler.js** - Handles command and interaction events.
- **openRouterService.js** - Manages API calls to OpenRouter.
- **utils.js** - Contains helper functions like related question generation.

## Contributing

Feel free to submit issues or pull requests for improvements!

## License

MIT License
