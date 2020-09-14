# Kata-Sensei
A discord bot used to automatically check for completed challenges on Codewars.com

# Requirements
Before using Kata-Sensei you need to download [Node.js](https://nodejs.org/en/download/).
Navigate to the root directory of the project, open a terminal and run the `npm install .` command.
This will install all the required modules for this project.

# Set up
Before you can run the bot, you have to create a `config.json` file at the root directory of the project.
This file contains configuration information for the bot. The only configuration option that you NEED to
specify is the discord bot token. An example configuration file is provided below:

    {
        "token": "<your_token>"
    }

# Running 
To run the bot, simply navigate to the root directory of the project, open a terminal and execute `node .`.
To terminate the bot, navigate to the terminal the bot is running on and press `Ctrl+C`.