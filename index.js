const Discord = require("discord.js");
const fs = require("fs");
const users = require("./users.json");
const config = require("./config.json");
const tokens = require("./token.json");
const bot = new Discord.Client({ ws: {intents: Discord.Intents.ALL}});
const debugClient = new Discord.WebhookClient(tokens.WEBHOOK_ID, tokens.WEBHOOK_TOKEN);

async function iHateDebugging(message) {
    if (config.debug == false) return;

    if (message.includes("Provided token")) return;

    await debugClient.send(message, {
        username: 'debug',
    });
}

bot.on("debug", iHateDebugging);
bot.on("error", iHateDebugging);
bot.on("warn", iHateDebugging);

bot.on("guildMemberAdd", async () => {
    bot.user.setActivity(`${bot.guilds.cache.find(x => x.name == `Definity Browser`).memberCount} users | >help`, { type: "WATCHING" });
});

bot.on("guildMemberRemove", async() => {
    bot.user.setActivity(`${bot.guilds.cache.find(x => x.name == `Definity Browser`).memberCount} users | >help`, { type: "WATCHING" });
});

bot.on("ready", async () => {
    console.log(`bot online`)

    bot.user.setActivity(`${bot.guilds.cache.find(x => x.name == `Definity Browser`).memberCount} users | >help`, { type: "WATCHING" });

});

bot.on("message", async message => {
    if (!users[message.author.id]) {
        users[message.author.id] = {
            strikes: 0,
            previousStrikes: []
        };

        fs.writeFileSync(`./users.json`, JSON.stringify(users));
    }

    let messageArray=message.content.split(" ");
    let [cmd,args,prefix]=[messageArray[0],messageArray.slice(1),">"];

    if (cmd == `${prefix}ban`) {
        let [banning, author, reason] = [, message.member, args.slice(1).join(" ")];

        try {
            banning = message.guild.member(bot.users.cache.find(x=>x.id==args[0]));
            console.log(banning.user.id);
        } catch(e) {
            message.channel.send("not id - attempting to look for user by tag ([USERNAME]#[TAG] NOT [USERNAME])");

            try {
                banning = message.guild.member(bot.users.cache.find(x=>x.tag==args[0]));
                console.log(banning.user.id);
            } catch(e) {
                return message.reply("failed - TAG");
            }
        }

        if (banning.user.id == "823589826225111091") return message.reply("failed - ID_CHECK");
        if (banning.hasPermission("MANAGE_MESSAGES")) return message.reply(`${banning.user.tag} cannot be banned!`);
        if (!author.hasPermission("BAN_MEMBERS")) return message.reply(`You do not have permission!`);

        if (!users[banning.user.id]) {
            users[banning.user.id] = {
                strikes: 0,
                previousStrikes: []
            }

            fs.writeFileSync(`./users.json`, JSON.stringify(users));
        }

        

        await banning.ban({ reason: reason });
        await message.guild.channels.cache.find(x => x.name == `warnings`).send(`${banning.user.username} (<@${banning.user.id}>) - ${reason} (${users[banning.user.id].strikes} -> Ban)`);
        users[kicking.user.id].previousStrikes.push([users[kicking.user.id].strikes, `BAN: ${reason}`]);
        fs.writeFileSync(`./users.json`, JSON.stringify(users));
        message.reply(`Banned.`);
    }

    if (cmd == `${prefix}kick`) {
        let [kicking, author, reason] = [, message.member, args.slice(1).join(" ")];

        try {
            kicking = message.guild.member(bot.users.cache.find(x=>x.id==args[0]));
            console.log(kicking.user.id);
        } catch(e) {
            message.channel.send("not id - attempting to look for user by tag ([USERNAME]#[TAG] NOT [USERNAME])");

            try {
                kicking = message.guild.member(bot.users.cache.find(x=>x.tag==args[0]));
                console.log(kicking.user.id);
            } catch(e) {
                return message.reply("failed - TAG");
            }
        }

        if (kicking.user.id == "823589826225111091") return message.reply("failed - ID_CHECK");
        if (kicking.hasPermission("MANAGE_MESSAGES")) return message.reply(`${kicking.user.tag} cannot be kicked!`);
        if (!author.hasPermission("KICK_MEMBERS")) return message.reply(`You do not have permission!`);

        if (!users[kicking.user.id]) {
            users[kicking.user.id] = {
                strikes: 0,
                previousStrikes: []
            }

            fs.writeFileSync(`./users.json`, JSON.stringify(users));
        }

        await kicking.kick({ reason: reason });
        await message.guild.channels.cache.find(x => x.name == `warnings`).send(`${kicking.user.username} (<@${kicking.user.id}>) - ${reason} (${users[kicking.user.id].strikes} -> Kick)`);
        users[kicking.user.id].previousStrikes.push([users[kicking.user.id].strikes, `KICK: ${reason}`]);
        fs.writeFileSync(`./users.json`, JSON.stringify(users));
        message.reply(`Kicked.`);
    }

    if (cmd == `${prefix}warn`) {
        if (!args[0] || !args[1] || !args[2] || isNaN(parseInt(args[1]))) return message.reply("missing or invalid args");

        let [warning, author, strikesToAdd, reason] = [, message.member, args[1], args.slice(2).join(" ")];

        try {
            warning = message.guild.member(bot.users.cache.find(x=>x.id==args[0]));
            console.log(warning.user.id);
        } catch(e) {
            message.channel.send("not id - attempting to look for user by tag ([USERNAME]#[TAG] NOT [USERNAME])");

            try {
                warning = message.guild.member(bot.users.cache.find(x=>x.tag==args[0]));
                console.log(warning.user.id);
            } catch(e) {
                return message.reply("failed - TAG");
            }
        }

        if (!users[warning.user.id]) {
            users[warning.user.id] = {
                strikes: 0,
                previousStrikes: []
            };
    
            fs.writeFileSync(`./users.json`, JSON.stringify(users));
        }

        let currentStrikes = users[warning.user.id].strikes;


        function addStrikes(strksToAdd, r, usrid) {
            users[usrid].strikes = users[usrid].strikes + strksToAdd;
            users[usrid].previousStrikes.push([users[usrid].strikes, r]);

            fs.writeFileSync(`./users.json`, JSON.stringify(users));
        }

        if (warning.user.id == "823589826225111091") return message.reply("failed - ID_CHECK");
        if (warning.hasPermission("MANAGE_MESSAGES")) return message.reply(`${warning.user.tag} cannot be warned!`);
        if (!author.hasPermission("MANAGE_MESSAGES")) return message.reply(`You do not have permission!`);

        if (currentStrikes == config.strikeMAX) {
            message.channel.send(`This user is at the max strikes! Use >ban.`);
        } else {
            addStrikes(parseInt(strikesToAdd), reason, warning.user.id);

            if (users[warning.user.id].strikes > config.strikeMAX) {
                message.reply("This user has reached more than the maximum strikes! Banning.");
                
                await warning.ban({ reason: reason });
                await message.guild.channels.cache.find(x => x.name == `warnings`).send(`${warning.user.username} (<@${warning.user.id}>) - ${reason} (${users[warning.user.id].strikes} -> AutoBan)`);
            } else {
                await message.guild.channels.cache.find(x => x.name == `warnings`).send(`${warning.user.username} (<@${warning.user.id}>) - ${reason} (${currentStrikes} -> ${users[warning.user.id].strikes})`);
            }
        }

     
    }

    if (cmd == `${prefix}unwarn`) {
        if (!args[0] || !args[1] || !args[2] || isNaN(parseInt(args[1]))) return message.reply("missing or invalid args");

        let [warning, author, strikesToRemove, reason] = [, message.member, args[1], args.slice(2).join(" ")];

        try {
            warning = message.guild.member(bot.users.cache.find(x=>x.id==args[0]));
            console.log(warning.user.id);
        } catch(e) {
            message.channel.send("not id - attempting to look for user by tag ([USERNAME]#[TAG] NOT [USERNAME])");

            try {
                warning = message.guild.member(bot.users.cache.find(x=>x.tag==args[0]));
                console.log(warning.user.id);
            } catch(e) {
                return message.reply("failed - TAG");
            }
        }

        if (!users[warning.user.id]) {
            users[warning.user.id] = {
                strikes: 0,
                previousStrikes: []
            };
    
            fs.writeFileSync(`./users.json`, JSON.stringify(users));
        }

        let currentStrikes = users[warning.user.id].strikes;


        function remStrikes(strksToRem, usrid) {
            users[usrid].strikes = users[usrid].strikes - strksToRem;

            fs.writeFileSync(`./users.json`, JSON.stringify(users));
        }

        if (warning.user.id == "823589826225111091") return message.reply("failed - ID_CHECK");
        if (warning.hasPermission("MANAGE_MESSAGES")) return message.reply(`${warning.user.tag} cannot be warned!`);
        if (!author.hasPermission("MANAGE_MESSAGES")) return message.reply(`You do not have permission!`);

        if (currentStrikes == 0) {
            message.channel.send(`This user has no strikes!.`);
        } else {
            remStrikes(parseInt(strikesToRemove), warning.user.id);

            await message.guild.channels.cache.find(x => x.name == `warnings`).send(`${warning.user.username} (<@${warning.user.id}>) - ${reason} (${currentStrikes} -> ${users[warning.user.id].strikes})`);
        }

     
    }

    if (cmd == `${prefix}clearstrikes`) {
        if (!args[0]) return message.reply(`missing id`);
        if (!args[1]) return message.reply(`args[1] is required: \`everything\`, \`paststrikes\` or \`strikecount\``);
        
        if (!users[args[0]]) return message.reply("user does not exist in warn log");

        switch (args[1]) {
            case "everything":
                users[args[0]].strikes = 0;
                users[args[0]].previousStrikes = [];

                fs.writeFileSync(`./users.json`, JSON.stringify(users));
            break;

            case "paststrikes":
                users[args[0]].previousStrikes = [];
                fs.writeFileSync(`./users.json`, JSON.stringify(users));
            break;

            case "strikecount":
                users[args[0]].strikes = 0;
                fs.writeFileSync(`./users.json`, JSON.stringify(users));
            break;

            default:
                message.reply("invalid option");
            
        }
    }

    if (cmd == `${prefix}strikes` || cmd == `${prefix}paststrikes`)  {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("no permissions");
        if (!args[0]) return message.reply("missing args");

        if (!users[args[0]]) return message.reply("this userID does not have a warning record");

        let strks = "";

        users[args[0]].previousStrikes.forEach(x => {
            strks += `${x[1]}\nStrikes at time: ${x[0]}\n\n`;
        });

        if (!args[1]) {
            message.channel.send(`Warnings\`\`\`txt\nCurrent strikes: ${users[args[0]].strikes}\n\n${strks}\`\`\``);
        } else if (args[1] == "dm") {
            message.author.send(`Warnings\`\`\`txt\nCurrent strikes: ${users[args[0]].strikes}\n\n${strks}\`\`\``);
        }
    }

    if (cmd == `${prefix}purge` || cmd == `${prefix}prune`) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("no permission");
        try {
            message.channel.bulkDelete(parseInt(args[0]));
        } catch (e) {
            message.reply("there was an error");
        }
    }

    if (cmd == `${prefix}help`) {
        message.channel.send(
            new Discord.MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`Command List\nPrefix: ${prefix}`)
            .addField(`ban <id/tag> <reason>`, `Ban a User`)
            .addField(`kick <id/tag> <reason>`, `Kick a user`)
            .addField(`warn <id/tag> <strikes> <reason>`, `Warn a user`)
            .addField(`unwarn <id/tag> <strikes> <reason>`, `Unwarn a user`)
            .addField(`strikes/paststrikes <id> [dm]`, `See strikelog of a user`)
            .addField(`clearstrikes <id> <everything/paststrikes/strikecount>`, `clear strikelog or strikecount of a user`)
            .addField(`purge/prune <amount>`, `purge messages from a channel`)
            .addField(`help`, `List commands`)
        )
    }
});

bot.login(tokens.BOT_TOKEN);