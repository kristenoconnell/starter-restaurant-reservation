const knex = require("../db/connection");

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRes) => createdRes[0]);
}

module.exports = {
    create,
}