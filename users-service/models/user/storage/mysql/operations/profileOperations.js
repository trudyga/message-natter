const db = require('../db');

exports.get = function (username) {
    "use strict";
    return db.user.get({
        username: username,
        withProfile: true
    }).then(u => u.profile);
};

exports.update = function (username, newProfile) {
    return exports.get(username).then(profile =>
        db.getProfileSchema()
            .then(schema => schema.update(newProfile, {where: {id: profile.id}})))
        .then(() => exports.get(username));
};