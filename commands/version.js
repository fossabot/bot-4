const Discord = require("discord.js");
const fs = require("graceful-fs");
const fetch = require('node-fetch');
const exec = require('child_process').exec;

module.exports.run = async (client, message, args) => {
    if (!(message.author.id === "563138570953687061") && !(message.author.id === "297096161842429963")) return;
    message.reply("Fetching version info...")

    exec('git rev-parse --verify HEAD', (error, stdout, stderr) => {
        if (error) {
            console.log(`exec error: ${error}`);
            return;
        }
        fetch(`https://api.github.com/repos/kami-blue/bot/commits/master`).then(res => res.json()).then((out) => {
            var latest_sha = out.sha;
            var local_sha = stdout;
            if (local_sha === latest_sha) var embedTitle = "All up to date!!";

            let versionEmbed = new Discord.MessageEmbed()
                .setTitle(embedTitle || "Update available")
                .setColor(client.colors.kamiblue)
                .setDescription(`**Latest Sha:** ${latest_sha}\n**Local Sha:** ${local_sha}`);
            message.channel.send(versionEmbed);

        }).catch(err => {
            console.log(err);
        });

    });

}

module.exports.config = {
    name: "version",
    aliases: [],
    use: "version",
    description: "version checker!!!",
    state: "gamma",
    page: 4
};