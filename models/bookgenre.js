"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class BookGenre extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    BookGenre.init(
        {
            bookId: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            genreId: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: "BookGenre",
        },
    );
    return BookGenre;
};
