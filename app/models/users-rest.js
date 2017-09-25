const log = require('debug')('message-natter:users-rest');

const clients = require('restify-clients');

// Creates a JSON client
const client = clients.createJsonClient({
    url: 'http://users-service'
});

/**
 * Get all users from users-service
 * @returns {Promise.<Object[]>} users array
 */
exports.getAllUsers = function () {
    return new Promise((resolve, reject) => {
        "use strict";
        client.get('/users', function (err, req, res, obj) {
            "use strict";
            if (err)
                reject(err);
            log('Return all users');
            resolve(obj);
        });
    });
};

/**
 * Get user from users-service
 * @param {String} username
 * @returns {Promise.<Object>} user
 */
exports.getUser = function (username) {
    "use strict";
    return new Promise((resolve, reject) => {
        client.get(`/users/${username}`, function (err, req, res, obj) {
           if (err)
               reject(err);
           log('Return specific user, username: ' + username);
           resolve(obj);
        });
    });
};

/**
 * Register new user with users-service
 * @param {Object} user - user to create
 * @returns {Promise<Object>} Created user
 */
exports.createUser = function (user) {
    "use strict";
    return new Promise((resolve, reject) => {
        client.post(`/users`,
            user,
            function (err, req, res, obj) {
                if(err)
                    reject(err);
                resolve(obj);
        });
    });
};

/**
 * Update user with users-service
 * @param {String} username
 * @param {Object} newUser - user fields to update
 * @returns {Promise.<Object>} Return updated user
 */
exports.updateUser = function (username, newUser) {
    "use strict";
    return new Promise((resolve, reject) => {
        client.update(`/users/${username}`,newUser, function (err, req, res, obj) {

        });
    });
};

/**
 * Remove user with users-service
 * @param {String} username
 * @returns {Promise.<Object>} Object with username of removed user
 */
exports.deleteUser = function (username) {
    "use strict";
    return new Promise((resolve, reject) => {
        client.del(`/users/${username}`, function (err, req, res, obj) {
           if (err)
               reject(err);
           resolve(obj);
        });
    });
};

/**
 * Try to authenticate user by username and password
 * @param {String} username - username to authenticate
 * @param {String} password - password to authenticate
 * @returns {Promise.<Object>} Object with authentication check and message
 */
exports.authenticate = function (username, password) {
    "use strict";
    return new Promise((resolve, reject) => {
        client.post(`/users/session`, {
            username: username, password: password
        }, function (err, req, res, obj) {
            if (err)
                reject(err);
            resolve(obj);
        });
    });
};

