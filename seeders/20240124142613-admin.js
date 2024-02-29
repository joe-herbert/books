"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Users",
            [
                {
                    id: "5885200d-51c0-418d-ae84-374e880fe0c4",
                    username: "bookAdmin",
                    password: bcrypt.hashSync("PCTAjt6hpaqnW*", 10),
                    permissions: "admin",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Users", null, {});
    },
};
