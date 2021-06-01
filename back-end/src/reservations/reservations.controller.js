const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validator = require("validator");
const service = require("./reservations.service");
const P = require("pino");
const knex = require("../db/connection");
const { rawListeners } = require("../app");

//-->MIDDLEWARE<--

//validation middleware
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "reservation_id",
  "created_at",
  "updated_at",
  "status"
];
  
//clunky middleware to check for missing or empty properties
async function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalid = [];
  if (!data.first_name || data.first_name === "") {
    invalid.push("first_name");
  }
  if (!data.last_name || data.last_name === "") {
    invalid.push("last_name");
  }
  if (!data.mobile_number || data.mobile_number === "") {
    invalid.push("mobile_number");
  }
  if (!data.reservation_date || data.reservation_date === "") {
    invalid.push("reservation_date");
  }
  if (!data.reservation_time || data.reservation_time === "") {
    invalid.push("reservation_time");
  }
  if (!data.people || data.people === "") {
    invalid.push("people");
  }
  //return invalid fields if any 
  if (invalid.length) {
    return next({
      status: 400,
      message: `Invalid fields: ${invalid.join(", ")}`
    })
  } next();
}

//validate people field is a number
async function validPeople(req, res, next) {
  const { data = { people } } = req.body;
  if (typeof(data.people) !== "number") {
    return next({
      status: 400,
      message: "people must be a number."
    })
  } next();
}

//validate date & time
async function validDate(req, res, next) {
  const { data = { reservation_date } } = req.body;
  if (!validator.isDate(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is not a valid date."
    })
  }
  next();
}

async function validTime(req, res, next) {
  const { data = { reservation_time } } = req.body;
  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const check = timeReg.test(data.reservation_time);
  if (!check) {
    return next({
      status: 400,
      message: "reservation_time is not a valid time."
    })
  } next();
}

//No reservations on Tuesdays
async function notTuesday(req, res, next) {
  const { data = { reservation_date } } = req.body;
  const day = new Date(data.reservation_date).getUTCDay();
  if (day === 2) {
    return next({
      status: 400,
      message: "This restaurant is closed on Tuesdays. Please choose a different day."
    })
  } next();
}

//No reservations in the past
async function isInFuture(req, res, next) {
  const { data = { reservation_date, reservation_time } } = req.body;
  const thisDate = Date.now();
  const resDate = new Date(`${data.reservation_date} ${data.reservation_time}`).valueOf();

  if (thisDate > resDate) {
    return next({
      status: 400,
      message: "Please select a future date and time."
    })
  } next();
}

//No reservations outside of business hours
async function withinBusinessHours(req, res, next) {
  const { data = { reservation_time } } = req.body;
  const time = data.reservation_time;
  if (time < "10:30" || time > "21:30") {
    return next({
      status: 400,
      message: "Reservations must be made between 10:30 AM and 9:30 PM."
    })
  } next();
}

//Reservation exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId)

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
      status: 404,
      message: `Reservation with ${reservationId} was not found.`
    })
}

//Reservation status for Creation
async function validStatus(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    if (status !== "booked") {
      return next({
        status: 400,
        message: `Cannot seat a reservation with a status of ${status}.`
      })
    } else if (status === "booked") {
      return next();
    }
  } next();
}

//Unknown or finished status
async function unknownOrFinished(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  const { status } = req.body.data;
 
  if (status === "unknown" || reservation.status === "finished") {
    return next({
      status: 400,
      message: `Cannot seat or update a reservation with a finished or unknown status.`
    })
  }
  next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let data;
  if (date) {
    data = await service.listByDate(date);
  } else if (mobile_number) {
    data = await service.search(mobile_number)
  } else {
    data = await service.list();
  }
  res.json({ data });
}

//Create handler
async function create(req, res) {
  const newRes = await service.create(req.body.data);
  res.status(201).json({ data: newRes });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function update(req, res) {
  const originalRes = res.locals.reservation;
  const updatedRes = {
    ...req.body.data,
    reservation_id: originalRes.reservation_id
  }
  const data = await service.update(updatedRes);
  res.json({ data });
}

async function updateStatus(req, res) {
  const { reservationId } = req.params;
  const { status } = req.body.data;
  const data = await service.updateStatus(reservationId, status)
  res.json({ data });
}

async function searchByNumber(req, res) {
  const { mobile_number } = req.body.data;
  const data = await service.searchByNumber(mobile_number);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasValidProperties),
    asyncErrorBoundary(validDate),
    asyncErrorBoundary(validTime),
    asyncErrorBoundary(validPeople),
    asyncErrorBoundary(notTuesday),
    asyncErrorBoundary(isInFuture),
    asyncErrorBoundary(withinBusinessHours),
    asyncErrorBoundary(validStatus),
    asyncErrorBoundary(create)
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(hasValidProperties),
    asyncErrorBoundary(validDate),
    asyncErrorBoundary(validTime),
    asyncErrorBoundary(validPeople),
    asyncErrorBoundary(notTuesday),
    asyncErrorBoundary(isInFuture),
    asyncErrorBoundary(withinBusinessHours),
    asyncErrorBoundary(validStatus),
    asyncErrorBoundary(unknownOrFinished),
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(unknownOrFinished),
    asyncErrorBoundary(updateStatus)
  ],
  searchByNumber: asyncErrorBoundary(searchByNumber)
};
