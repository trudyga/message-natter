const restify = require('restify');
const debug = require('debug')('users-service:server');

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

    // filter all the users
    storageModel.user.getAll()
        .then(users => users.filter(u => {
            if(options.username)
                return u.username === options.username;
            return true;
        }))
        .then(users => users.filter(u => {
            if (options.name)
                return u.name === options.name;
            return true;
        }))
        .then(users => users.filter(u => {
            if (options.surname)
                return u.surname === options.surname;
            return true;
        }))
        .then(users => users.filter(u => {
            if (options.country)
                return u.country === options.country;
            return true;
        }))
        .then(users => users.filter(u => {
            if (options.age)
            {
                let age = new Date(new Date() - u.dateOfBirth).getFullYear();
                return age === options.age;
            }
            return true;

        }))
        .then(users => {
            res.send(users);
            next(false);
        })
        .catch(err => {
            res.statusCode = 500;
            res.send(err.message);
            next(false);
        });
});

server.post('/users', function (req, res, next) {
    "use strict";
    let user = req.body;
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
        res.send(u);
        next(false);
    }).catch(err => {
        res.statusCode = 400;
        res.send(err.message);
        next(false);
    });
});

server.get('/users/:username', function (req, res, next) {
    let username = req.params.username;
    debug(`Get ${username} user`);
    storageModel.user.get(
        {
            username: username,
            withProfile: true
        }).then(u => {
        debug(u);
        if (!u)
            throw new Error('User does not exist');
        res.send(u);
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

server.post('/users/session', function (req, res, next) {
    "use strict";
    let username = req.body.username;
    let password = req.body.password;
    storageModel.user.get({username})
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

server.listen(port, function () {
    console.log('%s is listening on %s', server.name, server.url);
});

module.exports = server;