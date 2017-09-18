"use strict";
const Sequelize = require('sequelize').Sequelize;
const DataTypes = require('sequelize').DataTypes;
const Model = require('sequelize').Model;
const path = require('path');
const fs = require('fs');
const jsyaml = require('js-yaml');
const debug = require('debug')('users-service:mysql-db');
const errors = require('../../errors');

let db;
let User;
let Profile;
let Friend;

/**
 * Initialize and connect to db
 * @returns {Promise<Sequelize>} - db object
 */
module.exports.connectDb = function () {
    if (db) return Promise.resolve(db);

    return new Promise((resolve, reject) => {
        fs.readFile(process.env.DB_CONFIG, 'utf-8', (err, data) => {
            debug("Connection config file read!");
            if (err)
                reject(err);
            resolve(data);
        });
    })
        .then(text => jsyaml.safeLoad(text, 'utf-8'))
        .then(config => {
            db = new Sequelize(config.database, config.username, config.password, config.options);

            debug(`Path to folder: ${path.join(__dirname, './schemas/sqlUser.js')}`);

            exports.models = {
                User: db.import(path.join(__dirname, './schemas/sqlUser.js')),
                Profile: db.import(path.join(__dirname, './schemas/sqlProfile.js')),
                Friendship: db.import(path.join(__dirname, './schemas/sqlFriendship.js'))
            };

            exports.models.User.Profile = exports.models.User.hasOne(exports.models.Profile, {
                as: 'profile',
                foreignKey: 'userId',
                onDelete: 'CASCADE'});


            exports.schemas = {
                sqlUser: exports.models.User.sync(),
                sqlProfile: exports.models.Profile.sync(),
                sqlFriendship: exports.models.Friendship.sync(),
            };

            return db.sync();
        });
};

/**
 * Retrieve synchronized user schema.
 * @returns {Promise.<Model>} User schema model
 */
module.exports.getUserSchema = function () {
    return exports.connectDb().then(() => {
        if (exports.schemas.sqlUser)
            return exports.schemas.sqlUser;
        else throw new Error('User schema is not connected');
    });
};

/**
 * Retrieve synchronized profile schema.
 * @returns {Promise.<Model>} Profile schema model
 */
module.exports.getProfileSchema = function () {
    return module.exports.connectDb().then(() => {
        if (exports.schemas.sqlProfile)
            return exports.schemas.sqlProfile;
        else throw new Error('User schema is not connected');
    });
};

/**
 * Retrieve synchronized friendship schema.
 * @returns {Promise.<Model>} Friendship schema model
 */
module.exports.getFriendshipSchema = function () {
    return module.exports.connectDb().then(() => {
        if (exports.schemas.sqlFriendship)
            return exports.schemas.sqlFriendship;
        else throw new Error('User schema is not connected');
    });
};