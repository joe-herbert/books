"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Books", "blurb", {
            type: Sequelize.STRING,
            allowNull: false,
        });
        await queryInterface.addColumn("Books", "isbn", {
            type: Sequelize.STRING(16),
            allowNull: true,
        });
        await queryInterface.addColumn("Books", "link", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Books", "blurb");
        await queryInterface.removeColumn("Books", "isbn");
        await queryInterface.removeColumn("Books", "link");
    },
};
