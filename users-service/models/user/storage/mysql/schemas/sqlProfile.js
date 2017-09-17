

module.exports = function (db, DataTypes) {
    return db.define('Profile', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            required: true
        },
        name: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM,
            values: ['male', 'female'],
            required: true,
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            required: true,
            allowNull: false
        },
        photo: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
};