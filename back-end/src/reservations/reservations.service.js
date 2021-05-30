const knex = require("../db/connection");

function list() {
    return knex("reservations")
        .select("*");

}

function listByDate(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .whereNot({ status: "finished" })
        .whereNot({ status: "cancelled"})
        .orderBy("reservation_time", "asc");   
}

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRes) => createdRes[0]);
}

function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .first();
    
}

function update(updatedReservation) {
    return knex("reservations")
        .where({ reservation_id: updatedReservation.reservation_id })
        .update(updatedReservation, "*")
        .then((updated) => updated[0])
}

function updateStatus(reservationId, status) {
    return knex("reservations")
        .where({ reservation_id: reservationId })
        .update({ status: status }, "*")
        .then((updated) => updated[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
    list,
    listByDate,
    create,
    read,
    update,
    updateStatus,
    search,
}