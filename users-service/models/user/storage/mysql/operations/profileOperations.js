const db = require('../db');

/**
 * Get profile by username
 * @param {String} username - owner of the profile, which we want to retrieve
 * @returns {Request|Promise.<Object>|*} profile object
 */
exports.get = function (username) {
    "use strict";
    return db.user.get({
        username: username,
        withProfile: true
    }).then(u => u.profile);
};

/**
 * Update profile by username
 * @param {String} username
 * @param {Object} newProfile - fields which new profile would have
 * @returns {Promise.<Request>} Profile object
 */
exports.update = function (username, newProfile) {
    return exports.get(username).then(profile =>
        db.getProfileSchema()
            .then(schema => schema.update(newProfile, {where: {id: profile.id}})))
        .then(() => exports.get(username));
};

/**
 * Delete profile by username
 * @param {String} username
 */
exports.delete = function (username) {
    "use strict";
    return db.user.get(username).then(user => {
       return db.getProfileSchema().then(schema => {
           return schema.destroy({
               where: {userId: user.dataValues.id}
           });
       });
    });
};

/**
 * Delete all profiles
 * @returns {Promise.<Object>} number of affected rows
 */
exports.deleteAll = function () {
    return db.getProfileSchema().then(schema => {
        "use strict";
        return schema.destroy({
            where: {}
        });
    });
};