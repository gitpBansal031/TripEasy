const Listing = require("../models/listing");

//(show all listings)
module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find();
    res.render("listing/listing.ejs", { allListings});
};

//(show particular listing)
module.exports.renderListing = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "owner" } }).populate("owner"); //nested populate
    if (!listing) {
        return next(err);
    }
    res.render("listing/show.ejs", { listing });
};

//(new listing form)
module.exports.renderNewForm = (req, res, next) => {
    res.render("listing/new.ejs");
};

//(new listing logic)
module.exports.newListing = async (req, res, next) => {
    let listingObj = req.body.Listing;
    let filetype = req.file.mimetype;
    if (filetype == "image/png" || filetype == "image/jpg" || filetype == "image/jpeg") {
        let url = req.file.path;
        let filename = req.file.filename;
        listingObj.image = { url, filename };
    } else {
        req.flash("error", "Only png/jpg/jpeg files are allowed");
        return res.redirect(`/listing/new`);
    }
    const ownerId = req.user._id;
    listingObj = { ...listingObj, owner: ownerId }; //adding owner id to the listing obj
    // for (let key in listingObj) {
    // const val = listingObj[key];
    // if (key != 'image' && (val == '' || val == null || val == undefined)) {
    //         throw new expressError(400, "One or more required field are empty");
    //         return;
    //     }
    // }
    const newListing = new Listing(listingObj);
    await newListing.save(); //to save a single listing.(that insertMany method can also be used)
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
};

//(delete listing logic)
module.exports.deleteListing = async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);  //it will call the middleware in ./models/listing.js file to delete all reviews associated with it
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
};

//(update listing form)
module.exports.renderUpdateForm = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    //altering the url to limit the height and width of image so that it can be displayed on update form page
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload/", "/upload/h_150,w_250/");
    originalImage = originalImage.replace("w=800", "w=250&h=150");
    res.render("listing/update.ejs", { listing, originalImage });
};

//(update listing logic)
module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const obj = req.body.Listing;
    //to check if all the fields other than image are filled or not
    // for (let key in obj) {
    //     const val = obj[key];
    //     if (val == '' || val == null || val == undefined) {
    //         throw new expressError(400, "One or more required field are empty");
    //         return;
    //     }
    // }

    //if all fields are filled then this follows up
    if (typeof req.file !== "undefined") {
        let filetype = req.file.mimetype;
        if (filetype == "image/png" || filetype == "image/jpg" || filetype == "image/jpeg") {
            let url = req.file.path;
            let filename = req.file.filename;
            obj.image = { url, filename };
        } else {
            req.flash("error", "Only png/jpg/jpeg files are allowed");
            return res.redirect(`/listing/update/${id}`);
        }
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success", "Listing Updated!");
    res.redirect("/listing");
};