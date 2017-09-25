const restify = require('restify');
const debug = require('debug')('users-service:server');
const error = require('debug')('users-service:error');

const server = restify.createServer();
const storageModel = require('./models/user/storage');

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const port = process.env.PORT || 80;

/**
 * Return users list, filtered by query parameters
 */
server.get('/users', function (req, res, next) {
    "use strict";
    let options = {
        username: req.query.username,
        name: req.query.name,
        surname: req.query.surname,
        country: req.query.country,
        age: req.query.age
    };

    storageModel.user.getAll()
        .then(users => {
            return users.map(u => sanitizeUser(u));
        })
        // .then(users => users.filter(u => {
        //     if(options.username)
        //         return u.username === options.username;
        //     return true;
        // }))
        // .then(users => users.filter(u => {
        //     if (options.name)
        //         return u.profile.name === options.name;
        //     return true;
        // }))
        // .then(users => users.filter(u => {
        //     if (options.surname)
        //         return u.profile.surname === options.surname;
        //     return true;
        // }))
        // .then(users => users.filter(u => {
        //     if (options.country)
        //         return u.profile.country === options.country;
        //     return true;
        // }))
        // .then(users => users.filter(u => {
        //     if (options.age)
        //     {
        //         let age = new Date(new Date() - u.profile.dateOfBirth).getFullYear();
        //         return age === options.age;
        //     }
        //     return true;
        //
        // }))
        .then(users => {
            debug(users);
            res.send(users);
            next(false);
        })
        .catch(err => {
            res.statusCode = 500;
            res.send(err.message);
            next(false);
        });
});

/**
 * Register new user
 */
server.post('/users', function (req, res, next) {
    "use strict";
    let user = req.body;
    debug(`Get post user request`);
    debug(user);
    let u = {
        username: user.username,
        password: user.password,
        email: user.email,
        strategy: user.strategy,
        profile: {
            name: user.name,
            surname: user.surname,
            gender: user.gender,
            dateOfBirth: user.birthDate,
            country: user.country,
            photo: user.photo ? user.photo : '',
            description: user.description ? user.description : ''
        }
    };
    storageModel.user.create(u).then(u => storageModel.user.get({
        username: u.username,
        withProfile: true
    })).then(u => {
        res.statusCode = 201;
        res.send(sanitizeUser(u));
        next(false);
    }).catch(err => {
        error(err);
        res.statusCode = 400;
        res.send(err.message);
        next(false);
    });
});

/**
 * Retrieve specific user
 */
server.get('/users/:username', function (req, res, next) {
    let username = req.params.username;
    debug(`Get ${username} user`);
    storageModel.user.get(
        {
            username: username,
            withProfile: true
        }).then(u => {
        if (!u)
            throw new Error('User does not exist');

        let user = sanitizeUser(u);
        res.send(user);
        debug("Return user");
        debug(user);
        next(false);
    }).catch(err => {
        "use strict";
        res.statusCode = 404;
        res.send({
            message: "User not found"
        });
        next(false);
    });
});

/**
 * Delete specific user
 */
server.del('/users/:username', function (req, res, next) {
    "use strict";
    let username = req.params.username;
    storageModel.user.delete(username)
        .then(username => {
            res.send(username);
            next(false);
        }).catch(err => {
        debug(err);
        res.statusCode = 404;
        res.send({
            message: `Can't delete user ${username}. Doesn't exist`
        });
        next(false);
    });
});

server.put('/users/:username', function (req, res, next) {
    "use strict";
    let username = req.params.username;
    let user = req.body;

    if (!user) {
        res.statusCode = 400;
        res.send({
            message: `Must specify data to update`
        });
        next(false);
        return;
    }

    let userInfo = {
        password: user.password,
        email: user.email
    };
    let profile = {
        name: user.name,
        surname: user.surname,
        gender: user.gender,
        dateOfBirth: user.birthDate,
        country: user.country,
        description: user.description,
        photo: user.photo
    };

    storageModel.user.update(user.username, userInfo).then(() =>
        storageModel.profile.update(user.username, profile))
        .then(() => db.user.get({
            username: user.username,
            withProfile: true
        })).then(u => {
        res.statusCode = 200;
        res.send(u);
        next(false);
    }).catch(err => {
        res.statusCode = 404;
        res.send({message: `Can't modify user, ${user.username} wasn't found`});
        next(false);
    });
});

/**
 * Check password
 */
server.post('/users/session', function (req, res, next) {
    "use strict";
    let username = req.body.username;
    let password = req.body.password;
    storageModel.user.get({username: username})
        .then(u => {
            if (!u)
                res.send({
                    check:false,
                    username,
                    message: 'Username is incorrect'
                });
           if (u.password === password)
               res.send({
                   check: true,
                   username
               });
           else
               res.send({
                   check: false,
                   username,
                   message: 'Password is incorrect'
               });
        });
});

/**
 * Remove all unnecessary fields from user
 * @param {Object} user - db model instance
 * @returns {Object} sanitized user
 */
function sanitizeUser(user) {
    "use strict";
    let u = user.dataValues;
    u.profile = u.profile.dataValues;
    return u;
}

server.listen(port, function () {
    console.log('%s is listening on %s', server.name, server.url);
});

module.exports = server;