# moar-boosters-bot

Shitposting Reddit bot for replying to comments on /r/KerbalSpaceProgram containing "more boosters"

The bot is ratelimited to once every 5 minutes. Hopefully this is sufficient to appease the mods, but let me know if not.

### TODO:

* Make Destinations list generated rather than hardcoded
* fiddle with more dV calculation models, maybe asparagus staging

### Setup

If you want to fiddle with this bot yourself, you'll need:

* npm
* node
* `npm install`
* rename .env.template to .env, and enter the credentials from your own redditApp (reddit>preferences>apps)

Then `npm start` should be sufficient to start the bot.
