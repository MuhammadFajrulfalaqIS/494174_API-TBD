// Get all books
const getBooks = 'SELECT * FROM "book" ORDER BY "book_id" ASC';

// Get book by id
const getBooksById = 'SELECT * FROM "book" WHERE "book_id" = $1';

// Add book
const addBook = 'INSERT INTO "book" ("title", "description", "release_year", "language_id", "original_language_id", "num_of_pages", "last_update", "special_features", "fulltext", "rating", "price") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';

// Check if rating already exists
const checkRating = 'SELECT b FROM "book" b WHERE b."rating" = $1';

// Remove book
const removeBook = 'DELETE FROM "book" Where "book_id" = $1';

// Update book price
const updateBookPrice = 'UPDATE "book" SET "price" = $1 WHERE "book_id" = $2';

// Search books by keywords
const searchBooksByKeywords = `SELECT * FROM "book" WHERE "title" ILIKE '%' || $1 || '%' ORDER BY "book_id" ASC`;

// Get wishlist by customer id
const getWishlist = 'SELECT * FROM "wishlist" WHERE "customer_id" = $1';

// Add wishlist
const addWishlist = 'INSERT INTO "wishlist" ("inventory_id", "customer_id", "wishlist_date") VALUES ($1, $2, $3)';

// Remove wishlist
const removeWishlist = 'DELETE FROM "wishlist" WHERE "wishlist_id" = $1';

// Check if Wishlist exists
const checkWishlist = 'SELECT * FROM "wishlist" WHERE "wishlist_Id" = $1';

module.exports = {
    getBooks,
    getBooksById,
    addBook,
    checkRating,
    removeBook,
    updateBookPrice,
    searchBooksByKeywords,
    getWishlist,
    addWishlist,
    removeWishlist,
    checkWishlist,
};