const { Collection, Events, MessageFlags } = require('discord.js');

// Listen for interactions (slash commands) and execute the corresponding command if it exists in the collection
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName); // Get command from collection

		// if command doesn't exist log error
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		// Get the cooldowns collection from the client and set up cooldowns for the 
		// command if it doesn't already have an entry in the cooldowns collection
		const { cooldowns } = interaction.client;

		// If the command doesn't have an entry in the cooldowns collection, create one
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		// Get the current time, the timestamps for the command, 
		// the default cooldown duration, and the cooldown amount for the command
		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
		
		// If the command has cooldowns, check if the user is on a cooldown and 
		// if they are, reply with the remaining time until they can use it again
		if (timestamps.has(interaction.user.id)) {
			// calculate the expiration time for the user's cooldown and check if the current time has exceeded it
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				return interaction.reply({
					content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
					flags: MessageFlags.Ephemeral,
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		// try to execute command and catch errors during execution 
		// if error occurs log and relay error message to user
		try {
			await command.execute(interaction); // Execute the command
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};