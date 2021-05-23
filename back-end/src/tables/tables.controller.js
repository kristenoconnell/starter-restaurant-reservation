const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const data = await service.list();
    res.json({ data });
}

async function create(req, res) {
    const newTable = await service.create(req.body.data);
    console.log("new table", newTable);
    res.status(201).json({ data: newTable});
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: asyncErrorBoundary(create)
}