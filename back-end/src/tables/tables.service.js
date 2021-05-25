const knex = require("../db/connection");

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name", "asc");
}

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdTable) => createdTable[0]);
};

function read(tableId) {
    return knex("tables as t")
        .select("*")
        .where({ table_id: tableId })
        .first();
}

function update(tableId, reservationId) {
    return knex("tables")
        .where({ table_id: tableId })
        .update({ reservation_id: reservationId }, ["table_id", "table_name", "capacity", "status", "reservation_id"])
        .then((updatedTables) => updatedTables[0]);
}

function readReservation(reservationId) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservationId})
        .first();
}


module.exports = {
    list,
    create,
    read,
    update,
    readReservation
}