"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Genres",
            [
                {
                    id: "d1efa81e-c61b-4d2d-8adb-670884c8b1df",
                    name: "Fantasy",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Genres", null, {});
    },
};
