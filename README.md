# Definity Bot
Moderation Bot for our Discord server. <br>
Primarily built by @sudocode1, restructed by @JBMagination.

## What does it do?
This bot has all the moderation tools required for our [Discord Server](https://discord.gg/CWzsxwXvkK). This includes Banning, Kicking, a warning system and a few more tools.<br>
Feel free to contribute!

## Self-hosting
**This bot is intended for use in one server, not across multiple servers.**

### Requirements
- Node.js v15 (not tested on v14- but will most likely work)
- discord.js NPM package
- The bot files
- **SERVER MEMBERS INTENT ENABLED**
- token.json
<br>
Content of token.json:

```json
{
    "BOT_TOKEN": "YOUR_BOT_TOKEN",
    "WEBHOOK_ID": "YOUR_DEBUG_WEBHOOK_ID",
    "WEBHOOK_TOKEN": "YOUR_DEBUG_WEBHOOK_TOKEN"
}
```
<br>

`WEBHOOK_ID` and `WEBHOOK_TOKEN` are required if you enable `debug` in the config.

<br>
We recommend that you change some elements of the code that are not editable in the config yet. <br>
A primary example of this is ID_CHECK in ban, kick, warn and unwarn. This should be your bots id. <br>
Another example is bot.user.setActivity (<a href="https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=setActivity">ClientUser#setActivity</a>)

## Contributing
Contributions are welcome! Just make a Pull Request, we'll check if your code is useful, if it is - we will most likely add it! <br> <br>
If we deny your PR we will always give a proper reason, not just "this sucks" etc. <br> <br>
If your contribution gets denied, don't feel disheartened! You can always try adding something else that could be better for the bot.
