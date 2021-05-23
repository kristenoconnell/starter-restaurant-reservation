const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validator = require("validator");
const service = require("./reservations.service");

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
];
  
//clunky middleware to check for missing or empty properties
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  //console.log("data", data);
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
function validPeople(req, res, next) {
  const { data = { people } } = req.body;
  if (typeof(data.people) !== "number") {
    return next({
      status: 400,
      message: "people must be a number."
    })
  } next();
}

//validate date & time
function validDate(req, res, next) {
  const { data = { reservation_date } } = req.body;
  if (!validator.isDate(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is not a valid date."
    })
  }
  next();
}

function validTime(req, res, next) {
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
function notTuesday(req, res, next) {
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
function isInFuture(req, res, next) {
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
function withinBusinessHours(req, res, next) {
  const { data = { reservation_time } } = req.body;
  const time = data.reservation_time;
  if (time < "10:30" || time > "21:30") {
    return next({
      status: 400,
      message: "Reservations must be made between 10:30 AM and 9:30 PM."
    })
  } next();
}

/**
 * List handler for reservation resources
 */
async function listByDate(req, res) {
  const date = req.query.date;
  const data = await service.listByDate(date);
  //console.log("Data", data);
  res.json({ data });
}

//Create handler
async function create(req, res) {
  const newRes = await service.create(req.body.data);
  res.status(201).json({ data: newRes });
}

module.exports = {
  listByDate: asyncErrorBoundary(listByDate),
  create: [hasValidProperties, validDate, validTime, validPeople, notTuesday, isInFuture, withinBusinessHours, asyncErrorBoundary(create)]
};
