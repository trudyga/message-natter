const Sequelize = require('sequelize').Sequelize;
const DataTypes = require('sequelize').DataTypes;
const Model = require('sequelize').Model;
const path = require('path');
const fs = require('fs');
const jsyaml = require('js-yaml');
const debug = require('debug')('users-service:mysql-db');
const errors = require('../../../errors/index');

const db = require('../db');

/**
 * Return all friend of the user
 * @param {String} username - username to search the friends
 * @returns {Promise.<Object[]>} Friends
 */
exports.getAll = function (username) {
    "use strict";
    return db.getFriendshipSchema().then(schema => {
        return schema.findAll();
    });
};

/**
 * Delete all friends in the table
 * @returns {Promise.<Object>} number of affected rows
 */
exports.deleteAll = function () {
    "use strict";
    return db.getFriendshipSchema().then(schema => {
        return schema.destroy({
            where: {}
        });
    });
};

/**
 * Get friendship by id
 * @param {Number} frienshipId - id of the friendship
 * @returns {Promise.<Object>} Friendship object
 */
exports.get = function (frienshipId) {
    return db.getFriendshipSchema().then(schema => {
        "use strict";
        return schema.find({
            where: {id: frienshipId}
        });
    });
};

/**
 * Create new friendship
 * @param {String} senderUsername
 * @param {String} receiverUsername
 * @returns {Promise.<Object>} Created friendship object
 */
exports.create = function (senderUsername, receiverUsername) {
    "use strict";
    return db.getFriendshipSchema().then(schema => {
       schema.create({

       })
    });
};

/**
 * Remove friendship by id
 * @param {Number} friendshipId - friendship id
 * @returns {Promise.<Object>} id of the deleted friendship
 */
exports.delete = function (friendshipId) {
    "use strict";

};

/**
 * Set pending status of the friendship to false
 * @param {Number} frienshipId
 * @returns {Promise.<Object>} Friendship object
 */
exports.approve = function (frienshipId) {

};