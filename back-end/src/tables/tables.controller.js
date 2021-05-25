const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { table } = require("../db/connection");

//-->MIDDLEWARE<--

//valid properties
/*const validProperties = [
    "table_id",
    "table_name",
    "capacity",
    "status",
    "reservation_id"
]*/

async function hasValidPostProperties(req, res, next) {
    const { data = {} } = req.body;
    console.log("validCreateProps", req.body.data);
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

async function hasValidUpdateProperties(req, res, next) {
    const { data = {} } = req.body;
    console.log("update valid", req.body.data);
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

async function tableExists(req, res, next) {
    const tableId = req.params.tableId;
    //console.log("tableExists req", req.path);
    const table = await service.read(tableId);
    //console.log("table exists", table);
    if (table) {
        res.locals.table = table;
        return next();
    }
    next({
        status: 404,
        message: `Table with ${tableId} not found.`
    })
}

async function getReservation(req, res, next) {
    if (req.body.data && req.body.data.reservation_id) {
        let { reservation_id } = req.body.data;
        console.log("get reservation req body", req.body.data)
    
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

async function statusFree(req, res, next) {
    const table = res.locals.table;
    console.log("statusFree status", table.status);
    if (table.status === "Free") {
        return next();
    }
    next({
        status: 400,
        message: `Table ${table.table_name} is occupied. Please select a different table.`
    })
}
/* 
    returns 400 when table.status === "Occupied". But my tables don't seem to hold onto their "Occupied" value and instead revert back to their original status of "Free" anytime the dashboard is reloaded. 
    Missing the update from backend to front end?
    Something with useEffect and reloading the dashboard that starts all the tables clean?
    Something in the tablesList?
*/


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
    console.log("req body", req.body);
    //console.log("data.res", data.reservation_id);
    //console.log("req params", req.params)
    //console.log("table_id", table_id)
    const newTable = await service.update(table_id, data.reservation_id);
    newTable.status = "Occupied";
    console.log("updated table", newTable);
    //how to get the updated table status to replace the previous table status ???
    res.json({ data: newTable });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasValidPostProperties, asyncErrorBoundary(create)],
    read: [tableExists, asyncErrorBoundary(read)],
    update: [tableExists, getReservation, hasCapacity, hasValidUpdateProperties, statusFree, asyncErrorBoundary(update)]
}