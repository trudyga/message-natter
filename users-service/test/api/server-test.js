const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiAsPromised);
chai.use(chaiHttp);

const db = require('../../models/user/storage');
const server = require('../../server');

describe('Api test', function () {
    let request = chai.request('http://users-service-test:80');
    let user = require('../models/user/samples/user_latin.json');

    beforeEach('Remove all users' ,function () {
        return db.user.deleteAll();
    });
    describe('Get users', function () {
        beforeEach('Remove all users' ,function () {
            return db.user.deleteAll();
        });

        it('Should return single user', function () {
            "use strict";
            return db.user.create(user)
                .then(() => request
                    .get(`/users/${user.username}`)
                    .then(function (res) {
                        return res.should.have.status(200);
                    }));
        });

        it('Should return 404 if users does not exist', function () {
            return request.get('/users/doesnotexist')
                .then(function (res) {
                    throw new Error("User should not exist")
                })
                .catch(err => {
                    "use strict";
                    err.should.have.status(404);
                });
        });
    });

    describe('Get all users' ,function () {
        beforeEach('Remove all users' ,function () {
            return db.user.deleteAll();
        });

        it('Should return all users', function () {
            "use strict";
            return request
                .get('/users')
                .then(res => res.body.should.be.instanceOf(Array));
        });

        describe('Should return all users filtered by', function () {
            beforeEach('Remove all users', function () {
               return db.user.deleteAll().then(() => {
                   "use strict";
                   return db.user.create(user);
               });
            });
            //
            // it('name', function () {
            //     let name = user.profile.name;
            //     return request
            //         .get(`/users?name=${name}`)
            //         .then(res => {
            //             "use strict";
            //             res.body.should.be.instanceOf(Array);
            //             res.body.should.have.lengthOf(1);
            //         });
            // });
        });
    });

    describe('Post user', function () {
        "use strict";
        it('Should create user', function () {
            let user = {
                username: 'test',
                password: 'test',
                email: 'test@mail.ru',
                strategy: 'local',
                name: 'me',
                surname: 'me',
                birthDate: new Date(),
                gender: 'male',
                country: 'Ukraine',
                photo: '',
                description: ''
            };

            return request.post('/users')
                .send(user)
                .then(res => {
                    res.should.have.status(201);
                    res.body.should.have.deep.property('username', user.username);
                });
        });

        it('Should return 400 if not all fields specified', function () {
            let user = {
                username: 'test1',
                password: 'test1',
                email: 'test@mail.ru',
                photo: 'photo',
            };

            return request.post('/users')
                .send(user)
                .then(res => {
                    throw new Error("Should throw Bad Request");
                }).catch(err => {
                    err.should.have.status(400);
                });
        });
    });

    describe('PUT user', function () {
       beforeEach(function () {
           "use strict";
           return db.user.deleteAll()
               .then(() => db.user.create(user));
       });

       // it('Should update user', function () {
       //     "use strict";
       //     return request
       //         .put(`/users/${user.username}`)
       //         .send({
       //             "username": user.username,
       //             "name": "John",
       //             "surname": "Snow",
       //             "email": "john322@gmail.com",
       //             "birthDate": "1999-01-13",
       //             "gender": "male",
       //             "country": "Ukraine",
       //             "photo": "https://message-natter.com/resources/image/3242.jpg",
       //             "descrition": "This is sample description"
       //         }).then(res => {
       //             res.should.have.status(200);
       //         });
       // });

       it('Should return 404 if does not exist', function () {
           "use strict";
           return request.put(`/users/user-does-not-exist`)
               .send({
                   name: "John"
               }).then(res => {
                   throw new Error("User must not exist");
               }).catch(err => {
                   err.should.have.status(404);
               });
       });

       it('Should return 400 if user update info was not specified', function () {
          return request.put(`/users/${user.username}`)
              .then(res => {
                  "use strict";
                  throw new Error("Body must be rejected");
              })
              .catch(err => {
                  "use strict";
                  err.should.have.status(400);
              });
       });
    });

    describe('Authenticate user', function () {
        "use strict";
        beforeEach(function () {
            return db.user.create(user);
        });

        it('Should authenticate user', function () {
           return request
               .post(`/users/session`)
               .send({username: user.username, password: user.password})
               .then(res => {
                   res.should.have.status(200);
                   res.body.should.be.deep.equal({
                       check: true,
                       username: user.username,
                   });
               }) ;
        });
        it('Should not authenticate, incorrect password', function () {
           return request
               .post(`/users/session`)
               .send({
                   username: user.username,
                   password: 'incorrect'
               }).then(res => {
                   res.should.have.status(200);
                   res.body.should.be.deep.equal({
                       check: false,
                       username: user.username,
                       message: 'Password is incorrect'
                   });
               });
        });
        it('Should not authenticate, incorrect username', function () {
            return request
                .post(`/users/session`)
                .send({
                    username: 'incorrect',
                    password: 'incorrect'
                }).then(res => {
                    res.should.have.status(200);
                    res.body.should.be.deep.equal({
                        check: false,
                        username: 'incorrect',
                        message: 'Username is incorrect'
                    });
                });
        });
    });

    describe('Delete user', function () {
        "use strict";
        beforeEach(function () {
            return db.user.create(user);
        });

        it('Should delete user', function () {
            return request.del(`/users/${user.username}`)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('username', user.username);
                });
        });

        it('Should return 404 if user does not exist', function () {
            return request.del(`/users/user-does-not-exist`)
                .then(res => {
                    throw new Error(`Should return Bad Request`);
                })
                .catch(err => {
                    err.should.have.status(404);
                });
        });
    });
});