"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.addColumn("Books", "authorId", {
            type: Sequelize.UUID,
            references: {
                model: "Authors",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.removeColumn("Books", "authorId");
    },
};
