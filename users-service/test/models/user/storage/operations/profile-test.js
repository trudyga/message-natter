"use strict";
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = require('chai').expect;
const should = require('chai').should();

const util = require('util');
const debug = require('debug')('users-service:db-profile-test');
const db = require('../../../../../models/user/storage');

describe('Profile model storage operations' ,function () {
    let user = require('../../samples/user_latin.json');

    beforeEach(function () {
        return db.user.deleteAll();
    });

    afterEach(function () {
       return db.user.deleteAll();
    });

    it('Should get user profile' ,function () {
        return db.user.create(user).then(() => {
            let p = user.profile;
            return db.profile.get(user.username).then(profile => {
                profile.should.have.property('name', p.name);
                profile.should.have.property('surname', p.surname);
                profile.should.have.property('gender', p.gender);
                profile.should.have.property('photo', p.photo);
                profile.should.have.property('description', p.description);
                profile.should.have.property('country', p.country);
                profile.should.have.property('dateOfBirth', p.dateOfBirth);
            });
        });
    });

});