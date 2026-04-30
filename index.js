const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialise collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Get path for commands folder
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Folders that don't contain command files
const nonCommandFolders = [
  "helpers", 
  "handlers", 
  "wip"
];

// Dynamically read command files from the commands folder and set them in the commands collection. 
// This allows for easier scalability and organization of commands.
for (const folder of commandFolders) {
  if (nonCommandFolders.includes(folder)) continue; // Skip non command folders

  // Get path for commands
  const commandsPath = path.join(foldersPath, folder);
  // Only register .js files as command files
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  // Go through each command file and set them in the commands collection
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set command in the collection when containing data and execute properties
    if ('data' in command && 'execute' in command)
      client.commands.set(command.data.name, command);
    else
      // Warn when the command file is missing required properties
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

// Dynamically read event files from the events folder and register them as event listeners.
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once)
    // Register event listener that only triggers once
    client.once(event.name, (...args) => event.execute(...args));
  else
    // Register event listener that triggers every time the event is emitted
    client.on(event.name, (...args) => event.execute(...args));
}

// Log in to Discord with your client's token
client.login(token);