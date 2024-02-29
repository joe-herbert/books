"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "BookGenres",
            [
                {
                    bookId: "18ef07dc-d9ef-4894-bfd0-80c246901ed6",
                    genreId: "d1efa81e-c61b-4d2d-8adb-670884c8b1df",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("BookGenres", null, {});
    },
};
