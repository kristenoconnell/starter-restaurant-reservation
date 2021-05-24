const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { table } = require("../db/connection");

//-->MIDDLEWARE<--

//valid properties
const validProperties = [
    "table_id",
    "table_name",
    "capacity",
    "status",
    "reservation_id"
]

async function hasValidProperties(req, res, next) {
    const { data = {} } = req.body;
    if (!data || !data.table_name || data.table_name.length < 2 || !data.capacity || isNaN(data.capacity)) {
        return next({
            status: 400,
            message: "The following fields are required: table_name & capacity."
        })
    }
    next();
}

async function tableExists(req, res, next) {
    const { tableId } = req.params;
    const table = await service.read(tableId);
    if (table) {
        res.locals.table = table;
        return next();
    }
    next({
        status: 404,
        message: `Table with ${tableId} not found.`
    })
}

async function reservationExists(req, res, next) {
    const { reservationId } = req.body.data;
    console.log("body data", req.body.data)
    const reservation = reservations.find((reservation) => reservation_id === reservationId);
    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    next({
        status: 404,
        message: `Reservation with ${reservationId} not found.`
    })
}

async function hasCapacity(req, res, next) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;
    if (table.capacity >= reservation.capacity) {
        return next();
    }
    next({
        status: 400,
        message: `This table does not have capacity for a party size of ${reservation.capacity}. Please select a reservation with a party size of ${table.capacity} or less.`
    })
}

async function statusFree(req, res, next) {
    const table = res.locals.table;
    if (table.status === "Free") {
        return next();
    }
    next({
        status: 400,
        message: `Table ${table.table_name} is occupied. Please select a different table.`
    })
}


async function list(req, res) {
    const data = await service.list();
    res.json({ data });
}

async function read(req, res) {
    const table = res.locals.table;
    const data = await service.read(table.table_id);
    res.json({ data });
}

async function create(req, res) {
    const newTable = await service.create(req.body.data);
    res.status(201).json({ data: newTable});
}

async function update(req, res) {
    const { data = { reservationId } } = req.body;
    const { tableId } = req.params;
    console.log("req body", req.body);
    const data = await service.update(tableId, data.reservationId);
    console.log("updated table", newTable)
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasValidProperties, asyncErrorBoundary(create)],
    read: [tableExists, asyncErrorBoundary(read)],
    update: [reservationExists, hasCapacity, asyncErrorBoundary(update)]
}