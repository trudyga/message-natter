module.exports = class UserAlreadyExistError extends Error {
    constructor(username) {
        super(`User ${username} already exists`);
        Error.captureStackTrace(this, UserAlreadyExistError);

        this.username = username;
    }
}