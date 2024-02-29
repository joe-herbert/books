"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "BookTags",
            [
                {
                    bookId: "18ef07dc-d9ef-4894-bfd0-80c246901ed6",
                    tagId: "4c1b2735-a40a-4724-bcab-190e906af71f",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("BookTags", null, {});
    },
};
