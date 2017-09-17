const Sequelize = require('sequelize').Sequelize;
const DataTypes = require('sequelize').DataTypes;
const Model = require('sequelize').Model;
const path = require('path');
const fs = require('fs');
const jsyaml = require('js-yaml');
const debug = require('debug')('users-service:mysql-db');
const errors = require('../../../errors/index');

const db = require('../db');

exports.getAll = function (username) {
    "use strict";
    return db.getFriendshipSchema().then(schema => {
        return schema.findAll();
    });
};

exports.deleteAll = function () {
    "use strict";
    return db.getFriendshipSchema().then(schema => {
        return schema.destroy({
            where: {}
        });
    });
};

exports.get = function (frienshipId) {
    return db.getFriendshipSchema().then(schema => {
        "use strict";
        return schema.find({
            where: {id: frienshipId}
        });
    });
};

exports.create = function (senderUsername, receiverUsername) {
    "use strict";
    return db.getFriendshipSchema().then(schema => {
       schema.create({

       })
    });
};

exports.delete = function (friendshipId) {
    "use strict";

};

exports.approve = function (frienshipId) {

};