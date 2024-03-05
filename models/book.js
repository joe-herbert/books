"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Book.belongsTo(models.Author);
            Book.belongsToMany(models.Genre, { through: "BookGenre" });
            Book.belongsToMany(models.Tag, { through: "BookTag" });
        }
    }
    Book.init(
        {
            id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            name: { type: DataTypes.STRING, allowNull: false },
            blurb: { type: DataTypes.STRING, allowNull: false },
            notes: DataTypes.STRING,
            isbn: DataTypes.STRING(16),
            link: DataTypes.TEXT,
            cover: DataTypes.BLOB("long"),
            authorId: {
                type: DataTypes.UUID,
                model: "Author",
                key: "id",
            },
        },
        {
            sequelize,
            modelName: "Book",
        },
    );
    return Book;
};
