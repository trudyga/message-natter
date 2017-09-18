const errors = require('./errors');
const Profile = require('./Profile');

module.exports = class User {
    constructor(user) {
        this.username = user.username;
        this.password = user.password;
        this.strategy = user.strategy;
        this.email = user.email;

        if (user.profile)
            this.profile = new Profile(profile);
    }
};