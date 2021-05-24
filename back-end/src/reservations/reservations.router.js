/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

//router.route("/date").get(controller.listByDate);

router.route("/:reservation_id").get(controller.read);

router.route("/").get(controller.listByDate).post(controller.create);

module.exports = router;
