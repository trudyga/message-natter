const errors = require('errors');

module.exports = class Profile {
    constructor(profile) {

        if (profile.name
            && profile.surname
            && profile.photo
            && profile.gender
            && profile.country
            && profile.dateOfBirth
            && profile.createdAt
            && profile.updatedAt
            && profile.description) {
            this.name = profile.name;
            this.surname = profile.surname;
            this.username = profile.username;
            this.photo = profile.photo;
            this.gender = profile.gender;
            this.country = profile.country;
            this.dateOfBirth = profile.dateOfBirth;
            this.description = profile.description;
            this.createdAt = profile.createdAt;
            this.updatedAt = profile.updatedAt;
        }
        else {
            throw new Error("Profile initialization - incomplete data");
        }
    }

    /**
     *
     * @returns {Date}
     */
    get age() {
        return new Date(this.createdAt - Date.now());
    }
};