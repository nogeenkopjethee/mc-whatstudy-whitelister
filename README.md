# Minecraft WhatStudy Whitelister #

This is the backend for Minecraft WhatStudy, a little hobby project. Also the first time I'm trying out Node.js Express.

Made to work with this frontend: https://github.com/tcarbonclocks/mc-whatstudy

The goal of this project is to create an automatic whitelist for a Minecraft server for HBO-ICT students by using `whitelist.json`.


## How to run locally (if needed)
1. Make sure you have Node.js and NPM.
2. Run `npm install`.
3. Copy the `.env.example` and `whitelist.json.example` files to `.env` and `whitelist.json`.
4. If needed, set up the .env file to work with Minecraft RCON.
5. Run the app with `node app.js`.