"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Author extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Author.hasMany(models.Book);
        }
    }
    Author.init(
        {
            id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            name: { type: DataTypes.STRING, unique: true },
        },
        {
            sequelize,
            modelName: "Author",
        },
    );
    return Author;
};
