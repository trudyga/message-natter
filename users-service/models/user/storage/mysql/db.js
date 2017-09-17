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

module.exports.connectDb = function () {
    if (db) return Promise.resolve(db);

    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../../../../test/mysql-config-test.yaml'), 'utf-8', (err, data) => {
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
                onDelete: 'CASCADE'});


            // exports.models.User.FrienshipReceiver = exports.models.User.hasMany(exports.models.Friendship, {
            //     foreignKey: 'receiver',
            //     targetKey: 'username',
            //     onDelete: 'CASCADE'});
            // exports.models.User.FriendshipSender = exports.models.User.hasMany(exports.models.Friendship, {
            //     foreignKey: 'sender',
            //     targetKey: 'username',
            //     onDelete: 'CASCADE'});

            exports.schemas = {
                sqlUser: exports.models.User.sync(),
                sqlProfile: exports.models.Profile.sync(),
                sqlFriendship: exports.models.Friendship.sync(),
            };

            return db.sync();
        });
};

module.exports.getUserSchema = function () {
    return exports.connectDb().then(() => {
        if (exports.schemas.sqlUser)
            return exports.schemas.sqlUser;
        else throw new Error('User schema is not connected');
    });
};

module.exports.getProfileSchema = function () {
    return module.exports.connectDb().then(() => {
        if (exports.schemas.sqlProfile)
            return exports.schemas.sqlProfile;
        else throw new Error('User schema is not connected');
    });
};

module.exports.getFriendshipSchema = function () {
    return module.exports.connectDb().then(() => {
        if (exports.schemas.sqlFriendship)
            return exports.schemas.sqlFriendship;
        else throw new Error('User schema is not connected');
    });
};