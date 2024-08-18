const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedin, isOwner } = require("../middlewares.js");
const multer = require('multer')
const {storage} = require("../clouldConfig.js");
const upload = multer({ storage })

const listingController = require("../Controller/listing.js");

//INDEX ROUTE
router.get("/", wrapAsync(listingController.index));

//NEW ROUTE
router.get("/new", isLoggedin, listingController.new);

//READ ROUTE
router.get("/:id", wrapAsync(listingController.view));

//CREATE ROUTE
router.post("/", isLoggedin, upload.single('listings[image]'), wrapAsync(listingController.create));

//EDIT ROUTE
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.edit));

//UPDATE ROUTE
router.put("/:id", isLoggedin, isOwner,upload.single('listings[image]'), wrapAsync(listingController.update));

//DELETE ROUTE
router.delete("/:id", isLoggedin, isOwner, wrapAsync(listingController.delete));

module.exports = router;