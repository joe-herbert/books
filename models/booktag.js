"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class BookTag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    BookTag.init(
        {
            bookId: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            tagId: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: "BookTag",
        },
    );
    return BookTag;
};
