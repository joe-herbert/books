"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Authors",
            [
                {
                    id: "7a6e9f18-3c88-4d52-9608-5e4808dbdd5c",
                    name: "Roald Dahl",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Authors", null, {});
    },
};
