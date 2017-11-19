# Watch-Later

Web application for future movies you want to watch

## Installation

Install MongoDB (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

Install NodeJS 8 LTS (https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

Install dependencies: `npm install`. Create `config.local.js` (see the `config.js`: add the tmdb-api, mailjet, etc.).

Create the `watch-later.service` in `/etc/systemd/system/multi-user.target.wants/` directory:

```
[Unit]
Description=Watch-Later

[Service]
ExecStart=/usr/bin/node /home/Watch-Later/app.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
Environment=NODE_ENV=production
WorkingDirectory=/home/Watch-Later

[Install]
WantedBy=multi-user.target
```

Run `systemctl daemon-reload`.

Run `npm run build-app`.

Add an admin user directly from the MongoDB database:

- `use watch-later`
- `db.user.insert({ "name" : "Dewep", "email" : "dewep.net@gmail.com", "password" : "", "genres" : [ 28, 12, 35, 80, 18, 10749, 878, 53 ], "watchLater" : [ ], "ignored" : [ ], "notifications" : { "news" : true, "movieChanges" : true, "movieInTheatres" : true, "movieTorrents" : true }, "isAdmin" : true })`
- Go on the interface and ask a recovery password

## Credits

Favicon: https://github.com/lambdasoup/watchlater/
