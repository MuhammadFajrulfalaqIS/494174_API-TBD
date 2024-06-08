const { Router } = require("express");
const controller = require("./controller");

const router = Router();

// GET Method (Read)
router.get("/books", controller.getBooks);
router.get("/books/:id", controller.getBooksById);
router.get("/book-search", controller.searchBooksByKeywords);
router.get("/wishlist/:custId", controller.getWishlist);

// POST Method (Create)
router.post("/books", controller.addBook);
router.post("/wishlist", controller.addWishlist); // corrected from addWishlistS to addWishlist
router.post("/books/addmultiplebooks", controller.addMultipleBooks);
router.post("/wishlist/addmultiplewishlist", controller.addMultipleWishlist);

// PUT Method (Update)
router.put("/books/:id", controller.updateBookPrice);

// DELETE Method (Delete)
router.delete("/books/:id", controller.removeBook);
router.delete("/wishlist/:id", controller.removeWishlist);

module.exports = router;
