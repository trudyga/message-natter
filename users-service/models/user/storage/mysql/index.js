let db = require('./db');
let userOperations = require('./operations/userOperations');
let profileOperations = require('./operations/profileOperations');
let friendOperations = require('./operations/friendOperations');

db.user = userOperations;
db.profile = profileOperations;
db.friend = friendOperations;

module.exports = db;

