const Sequelize = require('sequelize').Sequelize;
const DataTypes = require('sequelize').DataTypes;
const Model = require('sequelize').Model;
const path = require('path');
const fs = require('fs');
const jsyaml = require('js-yaml');
const debug = require('debug')('users-service:mysql-db');
const errors = require('../../../errors/index');

const db = require('../db');

exports.get = function (options) {
    "use strict";
    if (!options)
        return Promise.reject("No options for user retrivement specified");

    if (options.username)
        return db.getUserSchema().then(schema =>
            schema.find(
                {
                    where: {username: options.username},
                    include: options.withProfile ? db.models.User.Profile : undefined
                }));
    if (options.id)
        return db.getUserSchema().then(schema =>
            schema.find({where: {id: options.id}}));
    else
        return Promise.reject("No id or password specified");
};

exports.getAll = function () {
    return db.getUserSchema().then(schema => {
        return schema.findAll({ include: [{ all: true, nested: true }]});
    });
};

exports.create = function (user) {
    return exports.get({username: user.username}).then(u => {
        if (u)
            throw new errors.UserAlreadyExistError(u.username);
        else
            return u;
    }).then(() => {
        return db.getUserSchema().then(schema => {
            return schema.create({
                username: user.username,
                password: user.password,
                email: user.email,
                strategy: user.strategy,
                profile: user.profile
            }, {
                include: [{
                    association: db.models.User.Profile
                }]
            });
        });
    });
};

exports.update = function (username, newUser) {
    "use strict";
    let login = username !== newUser.username ?
        newUser.username : username;

    return db.getUserSchema().then(schema => {
        return schema.update(newUser, {
            where: {username}
        }).then(() => exports.get({
            username: login,
            withProfile: true
        }));
    });
};

exports.updateUsername = function (username, newUsername) {
    return exports.get({username: username}).then(u => {
        "use strict";
        if (!u)
            throw new Error("User doesn't exist");
        if (u)
            return exports.get({username: newUsername}).then(newUser => {
                if (!newUser)
                    return db.getUserSchema().then(schema => schema.update({
                        username: newUsername
                    }, {
                        where: {username: username}
                    }));
                else
                    throw new errors.UserAlreadyExistError(u.username);
            });
            throw new errors.UserAlreadyExistError(u.username);
    }).then(() => exports.get({
        username: newUsername
    }));
};

exports.delete = function (username) {
    "use strict";
    return db.getUserSchema().then(schema => {
        return schema.find({where: {username}});
    }).then(u => {
        if (!u)
            throw "User doesn't exist";
        return u.destroy();
    }).then(() => {
        return {username};
    });
};

exports.deleteAll = function () {
    return db.getUserSchema().then(schema => {
        "use strict";
        schema.destroy({
            where: {}
        });
    });
};