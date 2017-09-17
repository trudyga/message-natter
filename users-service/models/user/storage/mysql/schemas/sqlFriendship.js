module.exports = function (db, DataTypes) {
    return db.define('Friendship',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            required: true,
            allowNull: false
        },
        pending: {
            type: DataTypes.BOOLEAN,
            required: true,
            allowNull: false
        },
    }, {
        timestamps: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
};
