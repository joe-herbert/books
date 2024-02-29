"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("BookGenres", {
            bookId: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            genreId: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("BookGenres");
    },
};
