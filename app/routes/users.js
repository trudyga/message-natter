const express = require('express');
const router = express.Router();
const debug = require('debug')('message-natter:users-route');

const users = require('../models/users-rest');


/* GET users listing. */
router.get('/', function(req, res, next) {
    "use strict";
    users.getAllUsers().then(users => {
        send(users);
    })
        .catch(err => {
            res.statusCode = 400;
            res.send(err);
        });
});

/**
 * Get user info
 */
router.get('/:username', function (req, res, next) {
    "use strict";
    users.getUser(req.params.username).then(
        obj => res.send(obj))
        .catch(err => {
            res.statusCode = 400;
            res.send(err);
        });
});

/**
 * Create new user
 */
router.post('/', function (req, res, next) {
    "use strict";
    debug('Create user route, user object is:');
    debug(req.body);
    let body = req.body;
    let user = {
        username: body.username,
        password: body.password,
        email: body.email,
        strategy: 'local',
        name: body.name,
        surname: body.surname,
        gender: body.gender,
        country: body.country,
        birthDate: body.birthDate,
        description: body.description
    };

    if (!user.username
        || !user.password
        || !user.email
        || !user.strategy
        || !user.name
        || !user.surname
        || !user.gender
        || !user.country
        || !user.birthDate
        ) {
        res.statusCode = 404;
        res.send({message: "Not all fields specified"});
    }

    users.createUser(user).then(u => {
        res.send(u);
    }).catch(err => {
        res.statusCode = 500;
        res.send();
    });
});



module.exports = router;
