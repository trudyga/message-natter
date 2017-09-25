const express = require('express');
const router = express.Router();
const debug = require('debug')('message-natter:session-route');

const users = require('../models/users-rest');
const jwt = require('jwt-simple');
const authConfig = require('../models/auth/auth-config.json');

/**
 * Return jwt token to the client
 */
router.post('/', function (req, res, next) {
    "use strict";
    let username = req.body.username;
    let password = req.body.password;
    debug("POST session");

    users.authenticate(username, password).then(check => {
        if (check && check.check) {
            let payload = {
                username: username,
                password: password
            };

            let token = jwt.encode(payload, authConfig.jwtSecret);
            debug("Token: " + token);
            res.json({
                token: token
            });
        }
        else {
            debug(check.message);
            res.statusCode = 401;
            res.json(check);
        }
    }).catch(err => {
        res.statusCode = 500;
        res.send(err);
    });
});

router.delete('/', function (req, res, next) {
    "use strict";

});

module.exports = router;