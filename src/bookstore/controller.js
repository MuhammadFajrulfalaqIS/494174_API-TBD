const pool = require("../../db");
const queries = require("./queries");

// Get all books
const getBooks = (req, res) => {
    pool.query(queries.getBooks, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

// Get book by id
const getBooksById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getBooksById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

// Add book
const addBook = (req, res) => {
    const { title, description, release_year, language_id, original_language_id, num_of_pages, last_update, special_features, fulltext, rating, price } = req.body;

    // Check if Rating already exists
    pool.query(queries.checkRating, [rating], (error, results) => {
        if (results.rows.length) {
            return res.send("Rating already exists");
        }

        // Add book to db
        pool.query(queries.addBook, [title, description, release_year, language_id, original_language_id, num_of_pages, last_update, special_features, fulltext, rating, price], (error, results) => {
            if (error) throw error;
            res.status(201).send("Book added successfully");
        });
    });
};

// Remove book
const removeBook = (req, res) => {
    const id = parseInt(req.params.id);

    // Check if book exists
    pool.query(queries.getBooksById, [id], (error, results) => {
        const noBookFound = !results.rows.length;
        if (noBookFound) {
            return res.send("Book does not exist in the database");
        }

        // Remove book from db
        pool.query(queries.removeBook, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send(`Book deleted with ID: ${id}`);
        });
    });
};

// Update book price
const updateBookPrice = (req, res) => {
    const id = parseInt(req.params.id);
    const { price } = req.body;

    // Check if book exists
    pool.query(queries.getBooksById, [id], (error, results) => {
        const noBookFound = !results.rows.length;
        if (noBookFound) {
            return res.send("Book does not exist in the database");
        }

        // Update book price
        pool.query(queries.updateBookPrice, [price, id], (error, results) => {
            if (error) throw error;
            res.status(200).send(`Book price updated with ID: ${id}`);
        });
    });         
};

// Search books by keywords
const searchBooksByKeywords = (req, res) => {
    const { keywords } = req.query;
    
    // Check if keywords are valid
    if (!keywords || typeof keywords !== "string") {
        return res.status(400).json({ error: "Invalid input" });
    }

    pool.query(queries.searchBooksByKeywords, [keywords], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

// Get Wishlist by customer id
const getWishlist = (req, res) => {
    const custId = parseInt(req.params.custId);

    pool.query(queries.getWishlist, [custId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

// Add Wishlist
const addWishlist = (req, res) => {
    const { inventory_id, customer_id, wishlist_date } = req.body;

    pool.query(queries.addWishlist, [inventory_id, customer_id, wishlist_date], (error, results) => {
        if (error) throw error;
        res.status(201).send("Wishlist added successfully");
    });
};

// Remove Wishlist
const removeWishlist = (req, res) => {
    const id = parseInt(req.params.id);

    // Check if Wislist exists
    pool.query(queries.checkWishlist, [id], (error, results) => {
        const noWishlistFound = !results.rows.length;
        if (noWishlistFound) {
            return res.send("Wishlist does not exist in the database");
        }
    
        // Remove Wishlist from db
        pool.query(queries.removeWishlist, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send(`Wishlist deleted with ID: ${id}`);
        });
    });
};

// Add Multiple Books with Transaction
const addMultipleBooks = (req, res) => {
    const { books } = req.body; // Array of book objects
  
    pool.connect((err, client, done) => {
        if (err) throw err;
  
        const handleError = (err) => {
            done();
            console.error(err);
            res.status(500).send("An error occurred");
        };
  
        // Start transaction
        client.query("BEGIN", (err) => {
            if (err) return handleError(err);
  
            const addBookPromises = books.map((book) => {
                const { title, description, release_year, language_id, original_language_id, num_of_pages, last_update, special_features, fulltext, rating, price } = book;
  
                return client.query(queries.addBook, [title, description, release_year, language_id, original_language_id, num_of_pages, last_update, special_features, fulltext, rating, price]);
            });
  
            Promise.all(addBookPromises)
                .then(() => {
                    // Commit transaction
                    client.query("COMMIT", (err) => {
                        if (err) return handleError(err);
                        done();
                        res.status(201).send("Books added successfully!");
                    });
                })
                .catch((err) => {
                    // Rollback transaction
                    client.query("ROLLBACK", (rollbackErr) => {
                        if (rollbackErr) return handleError(rollbackErr);
                        handleError(err);
                    });
                });
        });
    });
};

// Add Multiple Wishlist with Transaction
const addMultipleWishlist = (req, res) => {
    const { wishlists } = req.body; // Array of Wishlist objects

    pool.connect((err, client, done) => {
        if (err) throw err;

        const handleError = (err) => {
            done();
            console.error(err);
            res.status(500).send("An error occurred");
        };

        // Start transaction
        client.query("BEGIN", (err) => {
            if (err) return handleError(err);

            const addWishlistPromises = wishlists.map((wishlist) => {
                const { inventory_id, customer_id, wishlist_date } = wishlist;

                return client.query(queries.addWishlist, [inventory_id, customer_id, wishlist_date]);
            });

            Promise.all(addWishlistPromises) // corrected from addWishlistPromises to addWishlistPromises
                .then(() => {
                    // Commit transaction
                    client.query("COMMIT", (err) => {
                        if (err) return handleError(err);
                        done();
                        res.status(201).send("Wishlist added successfully!");
                    });
                })
                .catch((err) => {
                    // Rollback transaction
                    client.query("ROLLBACK", (rollbackErr) => {
                        if (rollbackErr) return handleError(rollbackErr);
                        handleError(err);
                    });
                });
        });
    });
};

module.exports = {
    getBooks,
    getBooksById,
    addBook,
    removeBook,
    updateBookPrice,
    searchBooksByKeywords,
    getWishlist,
    addWishlist,
    removeWishlist,
    addMultipleBooks,
    addMultipleWishlist,
};
