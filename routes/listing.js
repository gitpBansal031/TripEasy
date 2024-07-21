//Listing routes performing CRUD Operations
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const {storage}=require("../cloudConfig");
const upload = multer({storage});
//models
const { isLoggedIn, isOwner } = require("../middleware");
//controllers
const listingController = require("../controllers/listing");
//<---------------Routes------------------->

//Read (All listings) (Used for home page)
router.get("/", wrapAsync(listingController.index));

//Read (Paricular listing) (Used for show.js)
router.get("/show/:id", wrapAsync(listingController.renderListing));

//Create (Used for new.js)
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Update (Used for update.js)
router.get("/update/:id", isOwner, isLoggedIn, wrapAsync(listingController.renderUpdateForm));

//Delete
router.get("/delete/:id", isOwner, isLoggedIn, wrapAsync(listingController.deleteListing));

//logic part of creating a new listing
router.post("/", isLoggedIn,upload.single("Listing[image]"),wrapAsync(listingController.newListing));

//logic part of updating a listing
router.put("/:id", isOwner, isLoggedIn, upload.single("Listing[image]"),wrapAsync(listingController.updateListing));

module.exports = router;