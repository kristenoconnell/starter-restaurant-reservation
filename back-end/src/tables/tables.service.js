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
        .where({ tableId })
        .first();
}

function update(reservation_id, table_id) {
    return knex("tables")
        .where({ table_id })
        .update({ reservation_id }, ["table_id", "table_name", "capacity", "reservation_id"])
        .then((updatedTable) => updatedTable[0]);
}


module.exports = {
    list,
    create,
    read,
    update
}