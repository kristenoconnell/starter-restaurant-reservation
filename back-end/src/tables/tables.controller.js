const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { table } = require("../db/connection");

//-->MIDDLEWARE<--

//Valid properties for post request
async function hasValidPostProperties(req, res, next) {
    const { data = {} } = req.body;
    const errors = [];
    if (!data || !data.table_name || !data.capacity) {
        errors.push("The following fields are required: table_name & capacity.")
    }
    if (data.table_name === "" || data.table_name && data.table_name.length <= 1) {
        errors.push("Please include a valid table_name of at least 2 characters.")
    }
    if (!data.capacity || data.capacity === 0 || isNaN(Number(data.capacity))) {
        errors.push("Please include an integer for the capacity of thet table.")
    }
    if (errors.length) {
        return next({
            status: 400,
            message: `The following errors occured in the POST request: ${errors.join(", ")}`
        })
    }
    next();
}

//Valid properties for put request
async function hasValidUpdateProperties(req, res, next) {
    const { data = {} } = req.body;
    const errors = [];
    if (!data) {
        errors.push("The request body is invalid. Must include data.")     
    }
    if (!data.reservation_id) {
        errors.push("There is no reservation id in the request.")
    }
    if (errors.length) {
        return next({
            status: 400,
            message: `The following errors occured: ${errors.join(", ")}`
        })
    }
    next();
}

//Validate that table to update exists
async function tableExists(req, res, next) {
    const tableId = req.params.tableId;
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

//Find reservation from put request body data 
async function getReservation(req, res, next) {
    if (req.body.data && req.body.data.reservation_id) {
        let { reservation_id } = req.body.data;
    
        const reservation = await service.readReservation(reservation_id);
        if (reservation) {
            res.locals.reservation = reservation;
            return next();
        }
        next({
            status: 404,
            message: `Reservation with ${reservation_id} not found.`
        })
    } else {
        return next({
            status: 400,
            message: 'Request body has no data or is missing a reservation_id.'
        })
    }
}
    
//Ensure the table capacity is not less than the number of people in reservation
async function hasCapacity(req, res, next) {
    const table = res.locals.table;

    const { reservation_id } = req.body.data;
    const reservation = await service.readReservation(reservation_id)
    if (table.capacity >= reservation.people) {
        return next();
    }
    next({
        status: 400,
        message: `This table does not have capacity for a party size of ${reservation.people}. Please select a reservation with a party size of ${table.capacity} or less.`
    })
}

//Ensure the table is not already occupied
async function statusFree(req, res, next) {
    const table = res.locals.table;
    if (!table.reservation_id) {
        return next();
    }
    next({
      status: 400,
      message: `Table ${table.table_name} is occupied. Please select a different table.`,
    });
}

async function tableIsOccupied(req, res, next) {
    const tableId = req.params.tableId;
    const table = await service.read(tableId);
    if (table.reservation_id) {
        return next();
    }
    else {
        next({
            status: 400,
            message: `Table ${table.table_name} is not occupied.`,
        });
    }
}

async function statusSeated(req, res, next) {
    const tableId = req.params.tableId;
    const table = await service.read(tableId);
    const { reservation_id } = req.body.data
    const reservation = await service.readReservation(reservation_id);
    if (reservation.status === 'seated') {
        return next({
            status: 400,
            message: `Reservation ${reservation_id} is already seated.`
        })
    }
    next();
}

//<--CRUD functions-->/
async function list(req, res) {
    const data = await service.list();
    res.json({ data });
}

async function read(req, res) {
    const data = res.locals.table;
    res.json({ data });
}

async function create(req, res) {
    const newTable = await service.create(req.body.data);
    res.status(201).json({ data: newTable});
}

async function update(req, res) {
    const { data = { reservation_id } } = req.body;
    const table_id = req.params.tableId; 
    const newTable = await service.updateSeatRes(table_id, data.reservation_id);
    newTable.status = "Occupied";
    res.json({ data: newTable });
}

async function deleteTableAssignment(req, res) {
    const tableId = req.params.tableId;
    const table = await service.read(tableId);
    const reservationId = table.reservation_id;
    const id = Number(tableId)
    const deletedTable = await service.deleteTableAssignment(id, reservationId)
    res.status(200).json({ data: deletedTable });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasValidPostProperties, asyncErrorBoundary(create)],
    read: [tableExists, asyncErrorBoundary(read)],
    update: [tableExists, getReservation, hasCapacity, hasValidUpdateProperties, asyncErrorBoundary(statusFree), asyncErrorBoundary(statusSeated), asyncErrorBoundary(update)],
    delete: [tableExists, asyncErrorBoundary(tableIsOccupied), asyncErrorBoundary(deleteTableAssignment)]
}