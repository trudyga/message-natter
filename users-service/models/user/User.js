const errors = require('./errors');

module.exports = class User {
    constructor(user) {
        // if (!user.username
        // || !user.password
        // || !user.strategy
        // || !user.email)
        //     throw new errors.IncompleteDataError(['username', 'password', 'strategy', 'email']);

        this.username = user.username;
        this.password = user.password;
        this.strategy = user.strategy;
        this.email = user.email;

        if (user.profile)
            this.profile = new Profile(profile);
    }
};