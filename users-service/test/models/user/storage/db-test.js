"use strict";
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = require('chai').expect;
const should = require('chai').should();

const util = require('util');
const debug = require('debug')('users-service:db-test');

const db = require('../../../../models/user/storage');
const User = require('../../../../models/user/User');
const errors = require('../../../../models/user/errors');

describe('UsersDB', function () {
    beforeEach('Should remove all users', function () {
        return db.user.deleteAll();
    });

    it('DB connection must be established', function () {
        return db.connectDb().then(db => db.authenticate()).should.be.fulfilled;
    });

    it('User schema connection must be established', function () {
        return db.getUserSchema().should.be.fulfilled;
    });

    it('Profile schema connection must be established', function () {
        return db.getProfileSchema().should.be.fulfilled;
    });

    it('Friend schema connection must be established', function () {
        return db.getFriendshipSchema().should.be.fulfilled;
    });
});