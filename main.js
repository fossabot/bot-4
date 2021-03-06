// Import AuthFile
const auth = require("./auth.json");

const config = {
    prefix: ";",
    helpPages: [
        {
            "name": "Developer Commands",
            "emoji": "☕"
        },
        {
            "name": "Basic Commands",
            "emoji": "📜"
        },
        {
            "name": "FAQ Commands",
            "emoji": "<:kamiblue:637407885357482004>"
        },
        {
            "name": "Github Commands",
            "emoji": "<:jarfix:661737679351971840>"
        },
        {
            "name": "Moderation & Utility Commands",
            "emoji": "🔧"
        },
        {
            "name": "Music Commands",
            "emoji": "🎵"
        }
    ],
    "dj_role": "🎵 Javascript Music"
}

// Import Modules (for this file)
const Discord = require("discord.js");
const fs = require("graceful-fs");

// Client Definitions
const client = new Discord.Client();
client.queue = new Map();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.colors = {
    kamiblue: "9b90ff", // mfw magenta
    red: "de413c",
    green: "3cde5a",
    yellow: "deb63c"
}
client.config = config;

client.on("ready", () => {
    console.log("Bot loaded!");
    const activities_list = ["you skid KAMI", ";help", "help in the #help-en channel"]; // add more then add the type of them below
    const activities_type = ["WATCHING", "LISTENING", "STREAMING"]; // types are PLAYING WATCHING LISTENING and STREAMING
    setInterval(() => {
        const activityIndex = Math.floor(Math.random() * activities_list.length);
        client.user.setPresence({
            activity: {
                name: activities_list[activityIndex],
                type: activities_type[activityIndex]
            }
        });

    }, 60000); // One minute
    try {
        client.channels.cache.get("699982782515904603").send("Bot has started up!!");
    } catch (error) {
        (`${error}\nThis is a developmental version of the bot; as such some commands more integrated with the KAMI Blue Discord will **not** function as intended.`)
    }
    
});


fs.readdir("./commands/", (err, files) => {
    let jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0)
        return console.log(" \"./commands\" has no commandFiles. Are they in the right directory?");
    jsFiles.forEach((f, i) => {
        // it will log all the file names with extension .js
        let pull = require(`./commands/${f}`);
        console.log(`	- Searching ${f} \x1b[36m [Pending] \x1b[0m`); // Should be in colour
        if (pull.config) {
            client.commands.set(pull.config.name, pull);
            pull.config.aliases.forEach(alias => {
                client.aliases.set(alias, pull.config.name);
            });
            console.log(`	- Fetched command ${pull.config.name} from ${f} \x1b[32m [Resolved]\x1b[0m\n`);
        } else {
            console.log(`	- Does ${f} have no command? \x1b[31m[Rejected]\x1b[0m\n`)
        }
    });
    console.log("\n\n\x1b[1mCommands Loaded\x1b[22m\n\n")
});

client.on('message', async message => {
    let messageArray = message.content.split(" ")
    let prefix = config.prefix;
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    /* Command handler */
    if (message.content.startsWith(prefix)) {
        let commandFile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
        if (commandFile) commandFile.run(client, message, args);
    }

    if (message.author.bot) return; // Prevent botception loop
    autoResponder(message);
});

/**
 * @module starboard
 * @author sourTaste000
 * ( ͡° ͜ʖ ͡°)
 */
let pinnedMessages = [];
let i = 0;

client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.emoji.toString() === "⭐" && !pinnedMessages.includes(reaction.message.content)) {
            client.channels.cache.get('579741237377236992').send(`${user.username} voted for starboard`);
            if (reaction.count === 3) {
                pinnedMessages[i] = reaction.message.content;
                const image = reaction.message.attachments.size > 0 ? reaction.message.attachments.array()[0].url : ''; //very pog lol
                const starEmbed = new Discord.MessageEmbed()
                    .setAuthor("カミブルー！", "https://cdn.discordapp.com/avatars/638403216278683661/1e8bed04cb18e1cb1239e208a01893a1.png", "https://kamiblue.org")
                    .setDescription(reaction.message.content)
                    .addField("[link]", reaction.message.url, true)
                    .setFooter(reaction.message.author.username, reaction.message.author.avatarURL())
                    .setColor(client.colors.yellow)
                    .setTimestamp();
                client.channels.cache.get('735680230148276286').send(starEmbed);
                client.channels.cache.get('735680230148276286').send(image);
                i++
            }
    }
});

/**
 * @module rawPastebin
 * @author sourTaste000
 */
client.on('message', async message => {
    if(message.content.includes("pastebin.com/")){
        if (message.author.bot) return;
        let rawpaste = message.content;
        message.channel.send(`Raw:\n${rawpaste.replace("pastebin.com/", "pastebin.com/raw/")}`)
    }
})



/* when message is edited */
client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    autoResponder(newMessage);
});

/*
     ___        _         ______
   / _ \      | |        |  ___|
  / /_\ \_   _| |_ ___   | |_ __ _  __ _
  |  _  | | | | __/ _ \  |  _/ _` |/ _` |
  | | | | |_| | || (_) | | || (_| | (_| |
  \_| |_/\__,_|\__\___/  \_| \__,_|\__, |
                                      | |
                                      |_|
*/
function autoResponder(message) {
    /* members with roles bypass the filter */
    if (!message.member.hasPermission("CHANGE_NICKNAME")) {
        /* bad messages regexes */
        const discordInviteRegex = new RegExp("(d.{0,3}.{0,3}s.{0,3}c.{0,3}.{0,3}r.{0,3}d).{0,7}(gg|com.{0,3}invite)");
        const hacksRegex = new RegExp("(hack|hacks|cheat|cheats|hacking|salhack)");
        const slursRegex = new RegExp("(nigg(?!a).{1,2}|tran(?![spfqcg]).{1,2}|fag.{1,2}t|r(?!s).{1,2}tar.{1})");

        /* help regexes */
        const elytraRegex1 = new RegExp("(elytra|elytra.{0,2}light|elytra.{0,2}\\+|elytra.{0,2}fly)");
        const elytraRegex2 = new RegExp("(settings|config|configure)");

        const doesNotRegex = new RegExp("(does.{0,5}t)");
        const howWorkRegex = new RegExp("(what|work|how|how to)");
        const crashRegex = new RegExp("(c(?!a).{0,2}sh)");
        const installRegex = new RegExp("(install|open|download)")
        const guiRegex = new RegExp("(gui|menu|hud|click.?gui)")
        const forgeRegex = new RegExp("(f.{1,2}ge)")

        const versionRegex1 = new RegExp("(1.?(14|15|16))") /* (1.{0,1}(14|15|16)) */
        const versionRegex2 = new RegExp("(update|port|version)")

        let cleanedMessage = message.content.toLowerCase();
        /* hacks / cheats regex */
        if (hacksRegex.test(cleanedMessage.replace(/[^\w@430]/g, ""))) {
            message.channel.send("Hacks / cheats are against Discord TOS (Rules 3 and 9)");
        }

        /* discord invite link regex */
        if (discordInviteRegex.test(cleanedMessage)) {
            message.reply("lmfao stop advertising your discord server (Rule 5)");
            return message.delete();
        }

        /* slurs regex */
        if (slursRegex.test(cleanedMessage)) {
            message.reply("Slurs are against Rule 1b and 1c");
            return message.delete() // TODO: warn
        }

        /* elytra help regex */
        let elytraRegexMatches = 0;
        let elytraMatch = false;
        if (elytraRegex1.test(cleanedMessage)) { elytraMatch = true; elytraRegexMatches++; }
        if (doesNotRegex.test(cleanedMessage)) elytraRegexMatches++;
        if (howWorkRegex.test(cleanedMessage)) elytraRegexMatches++;
        if (elytraRegex2.test(cleanedMessage)) elytraRegexMatches++;

        if (elytraRegexMatches > 1 && elytraMatch) {
            return message.channel.send("Make sure you're using default settings in the latest beta. Run the defaults button in ElytraFlight's settings if you updated KAMI Blue before.\n\nIf it still doesn't help, make sure you're not using NoFall or any other movement related mods from **other** clients, such as Sprint in Rage mode, as they make you go over the speed limit and rubberband.");
        }

        /* game crash regex */
        if (crashRegex.test(cleanedMessage)) {
            message.channel.send("Find the `latest.log` file inside `~/.minecraft/logs` and paste the contents to https://pastebin.com/, and the send the link.");
        }

        /* new version regex */
        if (versionRegex1.test(cleanedMessage) && versionRegex2.test(cleanedMessage)) {
            message.channel.send("No, KAMI Blue will not be coming out for newer versions of Minecraft. It will stay on version `1.12.2` because it relies on version specific code. The developers are instead working on a new client called Vasya.\nVasya Website: https://vasya.dominikaaaa.org/")
        }

        /* how to install kami blue and forge regex */
        if (howWorkRegex.test(cleanedMessage) && installRegex.test(cleanedMessage)) {
            if (forgeRegex.test(cleanedMessage)) {
                message.channel.send("Download Forge from this link (<\https://files.minecraftforge.net/maven/net/minecraftforge/forge/index_1.12.2.html>)\nand select Installer. Open the file that it downloads and follow the instructions it gives you.")
            } else {
                message.channel.send("KAMI Blue is a 1.12.2 Forge mod.\nDownload KAMI Blue from <#634549110145286156> or the website at https://kamiblue.org/download, then open the file. This should open an installer where you can choose which version you want.\nTo find out more, please read the <More Info> at: https://kamiblue.org/download")
            }
        }

        /* how to open gui regex */
        if (howWorkRegex.test(cleanedMessage) && guiRegex.test(cleanedMessage)) {
            message.channel.send("Use `Y` to open the GUI. Use `;bind clickgui rshift` to change it.\nRead more at https://kamiblue.org/faq")
        }
    }
}

client.login(auth.token);
