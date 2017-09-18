const Sequelize = require('sequelize').Sequelize;
const DataTypes = require('sequelize').DataTypes;
const Model = require('sequelize').Model;
const debug = require('debug')('users-service:mysql-db');
const User = require('../../../User');
const errors = require('../../../errors');

const db = require('../db');

/**
 * Return user by username
 * @param {Object} options {username, withProfile}
 * @returns {Promise<Object>}
 */
exports.get = function (options) {
    "use strict";
    if (!options)
        return Promise.reject("No options for user retrievement specified");

    if (options.username)
        return db.getUserSchema().then(schema =>
            schema.find(
                {
                    where: {username: options.username},
                    include: options.withProfile ? db.models.User.Profile : undefined
                }));
    if (options.id)
        return db.getUserSchema().then(schema =>
            schema.find({
                where: {id: options.id},
            }));
    else
        return Promise.reject("No id or password specified");
};

/**
 * Return all users
 * @returns {Promise.<Object[]>}
 */
exports.getAll = function () {
    return db.getUserSchema().then(schema => {
        return schema.findAll({
            include: [{
                model: db.models.Profile,
                as: 'profile'
            }]
        });
    });
};

/**
 * Add new user to storage
 * @param {Object} user
 * @returns {Promise.<Object>}
 */
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

/**
 * Update user fields in storage
 * @param {String} username - username of the user to update
 * @param {Object} newUser - new user fields to update
 * @returns {Promise.<Object>} - New user object
 */
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

/**
 * Updates username of the specified user
 * @param {String} username - Username to update
 * @param {String} newUsername - New username
 * @returns {Promise.<Object>}
 */
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

/**
 * Delete user by username
 * @param {String} username - Username
 * @returns {Promise.<Object>} Username of destroyed user
 */
exports.delete = function (username) {
    "use strict";
    return db.getUserSchema().then(schema => {
        return schema.find({where: {username}});
    }).then(u => {
        if (!u)
            throw "User doesn't exist";
        return u.destroy();
    }).then(() => {
        db.profile.delete(username)
    }).then(() => {return {username}});
};

/**
 * Remove all users from the database
 * @returns {Promise.<Object>} Number of affected rows
 */
exports.deleteAll = function () {
    return db.getUserSchema().then(schema => {
        "use strict";
        return schema.destroy({
            where: {}
        }).then(() => db.profile.deleteAll());
    });
};