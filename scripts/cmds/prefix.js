const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "7.0",
		author: "Modified by You",
		description: "Prefix info with GIF, typing effect & auto delete",
		category: "Utility"
	},

	onStart: async function ({ message, event, api }) {

		const ping = Date.now() - event.timestamp;
		const day = new Date().toLocaleString("en-US", { weekday: "long" });
		const BOTNAME = global.GoatBot.config.nickNameBot || "✦ 𝙏𝙊𝙍𝙐 𝘾𝙃𝘼𝙉 ✦";
		const BOTPREFIX = global.GoatBot.config.prefix;
		const GROUPPREFIX = utils.getPrefix(event.threadID);


const loadingStages = [
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▱▱▱▱▱▱▱▱▱ 10%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▱▱▱▱▱▱▱ 30%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▱▱▱▱▱ 50%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▱▱▱ 70%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▰▰▱ 90%",
      "𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐫𝐞𝐟𝐢𝐱...\n▰▰▰▰▰▰▰▰▰▰ 100%"
    ];

    let loadingMsg = await api.sendMessage({ body: loadingStages[0] }, event.threadID);
    for (let i = 1; i < loadingStages.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      try { await api.editMessage(loadingStages[i], loadingMsg.messageID); } catch {}
    }
    try { await api.unsendMessage(loadingMsg.messageID); } catch {}



		// GIF list
		const gifs = [
			"https://i.imgur.com/Xw6JTfn.gif",
			"https://i.imgur.com/KUFxWlF.gif",
			"https://i.imgur.com/FV9krHV.gif",
			"https://i.imgur.com/lFrFMEn.gif",
			"https://i.imgur.com/KbcCZv2.gif",
			"https://i.imgur.com/QC7AfxQ.gif",
			"https://i.imgur.com/TtAOEAO.gif",
			"https://i.imgur.com/mW0yjZb.gif",
			"https://i.imgur.com/KQBcxOV.gif"
		];

		const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

		const gifFolder = path.join(__dirname, "cache");
		if (!fs.existsSync(gifFolder)) fs.mkdirSync(gifFolder, { recursive: true });

		const gifName = path.basename(randomGif);
		const gifPath = path.join(gifFolder, gifName);

		// Download GIF if not exists
		if (!fs.existsSync(gifPath)) {
			await new Promise((resolve, reject) => {
				const file = fs.createWriteStream(gifPath);
				https.get(randomGif, res => {
					res.pipe(file);
					file.on("finish", () => file.close(resolve));
				}).on("error", reject);
			});
		}

		// Typing effect simulation for final message
		const lines = [
			"🌟╔═༶• 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢 •༶═╗🌟",
			`🕒 Ping: ${ping}ms`,
			`📅 Day: ${day}`,
			`🤖 Bot Name: ${BOTNAME}`,
			`💠 Bot Prefix: ${BOTPREFIX}`,
			`💬 Group Prefix: ${GROUPPREFIX}`,
			"🌟╚═༶• 𝗘𝗻𝗱 𝗢𝗳 𝗦𝘁𝗮𝘁𝘂𝘀 •༶═╝🌟"
		];

		let finalMsg = "";
		for (let line of lines) {
			finalMsg += line + "\n";
			await new Promise(r => setTimeout(r, 350)); // typing effect delay
		}

		// Send final message with GIF
		const sentMsg = await message.reply({
			body: finalMsg,
			attachment: fs.createReadStream(gifPath)
		});

		// Auto unsend after 30 seconds
		setTimeout(() => {
			api.unsendMessage(sentMsg.messageID);
		}, 30000);
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			return this.onStart({ message, event, api: global.GoatBot.api });
		}
	}
};
