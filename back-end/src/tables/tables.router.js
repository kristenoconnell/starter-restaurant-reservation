const router = require("express").Router();
const controller = require("./tables.controller");

router
    .route("/:tableId([0-9]+)/seat")
    .put(controller.update);

router
    .route("/:tableId([0-9]+)")
    .get(controller.read);

router
    .route("/")
    .get(controller.list)
    .post(controller.create);

module.exports = router;
