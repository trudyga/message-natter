"use strict";
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = require('chai').expect;
const should = require('chai').should();

const util = require('util');
const debug = require('debug')('users-service:db-users-test');

const db = require('../../../../../models/user/storage');
const User = require('../../../../../models/user/User');
const errors = require('../../../../../models/user/errors');

describe('User model storage operations', function () {
    let user = require('../../samples/user.json');
    let latinUser = require('../../samples/user_latin.json');

    describe('User creation operations', function () {
        afterEach(function () {
            return db.user.deleteAll();
        });

        it('Create user', function () {
            return db.user.create(user).should.be.fulfilled
                .and.should.eventually.have.property('id');
        });

        it('Create user with utf-8 specific symbols', function () {
            return db.user.create(latinUser).should.be.fulfilled
                .and.should.eventually.have.property('username', latinUser.username);
        });

        it('Should throw exception if user already exists', function () {
            return db.user.create(user).then(() => {
                return db.user.create(user)
            })
                .should.be.rejectedWith(errors.UserAlreadyExistError);
        });
    });

    describe('Get user operations', function () {
        beforeEach(function () {
            return db.user.create(user).then(() => db.user.create(latinUser));
        });

        afterEach(function () {
            return db.user.deleteAll();
        });

        it('Should throw exception when no parameters passed', function () {
            return db.user.get().should.be.rejected;
        });

        it('Should throw exception when both id or username are not specified', function () {
            return db.user.get({wrongProp: "wrongProp"})
                .should.be.rejectedWith('No id or password specified');
        });

        it('Should return user by specified username', function () {
            return db.user.get({username: user.username})
                .should.be.fulfilled
                .and.should.eventually.have.property('username', user.username);
        });

        it('Should return user with profile is options is specified', function () {
            return db.user.get({
                username: latinUser.username,
                withProfile: true
            }).should.be.fulfilled
                .and.should.eventually.have.property('profile');
        });
    });

    describe('Get all operations', function () {
        beforeEach(function () {
            return db.user.create(user);
        });

        it('Should return all users' ,function () {
            return db.user.getAll().then(users => {
                debug(JSON.stringify(users));
                return users
            }).should.be.fulfilled
                .and.should.eventually.be.instanceOf(Array);
        });

        afterEach(function () {
            return db.user.deleteAll();
        });
    });

    describe('Deletion operations', function () {
        beforeEach('Create user to deletion', function () {
            return db.user.create(latinUser);
        });

        it('Should remove user', function () {
            return db.user.delete(latinUser.username).should.be.fulfilled
                .and.should.eventually.have.property('username', latinUser.username);
        });

        it('Should throw an exception if user doesn\' exist', function () {
            return db.user.delete("user_doesn't_exist").should.be.rejectedWith("User doesn't exist");
        });

        afterEach('Remove all users', function () {
            return db.user.deleteAll();
        });
    });

    describe('Update user operations', function () {
        beforeEach('Create user', function () {
            return db.user.deleteAll().then(() => db.user.create(user));
        });

        it('Should update username' , function () {
            let oldUsername = user.username;
            return db.user.updateUsername(oldUsername, 'new_username')
                .should.be.fulfilled
                .and.should.eventually.have.property('username', 'new_username');
        });

        it('Should throw exception if user already exist', function () {
            let oldUsername = user.username;
            let newUsername = oldUsername;
            return db.user.updateUsername(oldUsername, newUsername)
                .should.be.rejectedWith(errors.UserAlreadyExistError);
        });

        it('Should throw exception if user doesnt exist', function () {
            let username = 'ThisUserDoesntExist';
            return db.user.updateUsername(username, 'shouldNotUpdate')
                .should.be.rejectedWith("User doesn't exist");
        });
    });
});