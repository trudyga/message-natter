module.exports = function (db, DataTypes) {
    return db.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            required: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            required: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        strategy: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
};