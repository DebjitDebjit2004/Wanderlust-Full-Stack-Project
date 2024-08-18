const listing = require("../DatabaseSchema/schema")

module.exports.index = async (req, res) => {
    const allListing = await listing.find({});
    res.render("./listing/index", { allListing });
}

module.exports.new = (req, res) => {
    res.render("./listing/new");
}

module.exports.view = async (req, res) => {
    let { id } = req.params;
    const listingDetails = await listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    res.render("./listing/view", { listingDetails });
}

module.exports.create = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename)
    const newListing = new listing(req.body.listings);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listing");
}

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    res.render("./listing/edit", { editListing });
}

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findByIdAndUpdate(id, { ...req.body.listings });
    

    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        editListing.image = { url, filename};
        await editListing.save();
    }

    req.flash("success", "Update Listing")
    res.redirect(`/listing/${id}`);
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Delete Listing")
    res.redirect("/listing");
}