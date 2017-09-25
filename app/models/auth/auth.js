const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('../users-rest');

const config = require('./auth-config.json');

passport.use(new JwtStrategy({
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, function (jwt_payload, done) {
    "use strict";
    let username = jwt_payload.username;
    let password = jwt_payload.password;

    users.authenticate(username, password).then(check => {
        if (check) {
            if (check.check === true)
                done(null, {username: check.username});
            else
                done(null, false, {
                    username: check.username,
                    message: check.message
                });
        } else {
            done(new Error('Check object is not defined!'));
        }
    }).catch(err => {
        done(err);
    });
}));

module.exports = {
    initialize: function () {
        return passport.initialize();
    },
    authenticate: function () {
        return passport.authenticate("jwt", config.jwtSession);
    }
};