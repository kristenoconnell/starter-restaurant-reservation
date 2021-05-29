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
    return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .first();
}

async function updateSeatRes(tableId, reservationId) {
    const trx = await knex.transaction();
    let updated = {};
    return trx("reservations")
        .where({ reservation_id: reservationId })
        .update({ status: "seated" })
        .then(() =>
            trx("tables")
                .where({ table_id: tableId })
                .update({ reservation_id: reservationId }, ["table_id", "table_name", "capacity", "status", "reservation_id"])
                .then((result) => (updated = result[0]))
        )
        .then(trx.commit)
        .then(() => updated)
        .catch(trx.rollback);           
}

function readReservation(reservationId) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservationId})
        .first();
}

async function deleteTableAssignment(tableId, reservationId) {
    const trx = await knex.transaction();
    let updated = {};
    return trx("reservations")
        .where({ reservation_id: reservationId })
        .update({ status: "finished" })
        .then(() =>
            trx("tables")
                .where({ table_id: tableId })
                .update({ reservation_id: null }, ["table_id", "table_name", "capacity", "status", "reservation_id"])
                .then((result) => result[0])
    )
        .then(trx.commit)
        .then(() => updated)
        .catch(trx.rollback);
}


module.exports = {
    list,
    create,
    read,
    updateSeatRes,
    readReservation,
    deleteTableAssignment
}