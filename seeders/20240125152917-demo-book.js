"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Books",
            [
                {
                    id: "18ef07dc-d9ef-4894-bfd0-80c246901ed6",
                    authorId: "7a6e9f18-3c88-4d52-9608-5e4808dbdd5c",
                    name: "Charlie and the Chocolate Factory",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Books", null, {});
    },
};
