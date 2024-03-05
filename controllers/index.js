const express = require("express");
const router = express.Router();
const models = require("../models");
const bcrypt = require("bcrypt");
const { sendErr } = require("./base");
const { Op } = require("sequelize");
const { admin } = require("../middleware/admin");

function whereSplit(query, where, prop) {
    if (typeof query === "object") {
        where[prop] = {
            [Op.or]: query,
        };
        return query;
    } else {
        where[prop] = query;
        return [query];
    }
}

router.get("/", (req, res) => {
    req.session.userId = "5885200d-51c0-418d-ae84-374e880fe0c4";
    console.log(typeof req.query.author);
    let filterIds = {
        authors: [],
        genres: [],
        tags: [],
    };
    let where = {};
    if (req.query.author) {
        filterIds.authors.push(...whereSplit(req.query.author, where, "authorId"));
    }
    let genreWhere = {};
    if (req.query.genre) {
        filterIds.genres.push(...whereSplit(req.query.genre, genreWhere, "id"));
    }
    let tagWhere = {};
    if (req.query.tag) {
        filterIds.tags.push(...whereSplit(req.query.tag, tagWhere, "id"));
    }
    models.Book.findAll({
        where: where,
        include: [
            {
                model: models.Author,
                attributes: ["name", "id"],
            },
            {
                model: models.Genre,
                attributes: ["name", "id"],
                where: genreWhere,
            },
            {
                model: models.Tag,
                attributes: ["name", "id"],
                where: tagWhere,
            },
        ],
        order: ["name"],
    }).then((dbBooks) => {
        let books = [];
        for (let book of dbBooks) {
            books.push({
                id: book.id,
                title: book.name,
                cover: book.cover,
                blurb: book.blurb,
                author: {
                    id: book.Author.id,
                    name: book.Author.name,
                },
                /*genres: book.Genres.map((genre) => {
                    return {
                        id: genre.id,
                        name: genre.name,
                    };
                }),
                tags: book.Tags.map((tag) => {
                    return {
                        id: tag.id,
                        name: tag.name,
                    };
                }),*/
            });
        }
        if (req.session && req.session.userId) {
            models.User.findOne({
                where: {
                    id: req.session.userId,
                },
                attributes: ["permissions"],
            }).then((user) => {
                if (user.permissions === "admin") {
                    models.Author.findAll({
                        attributes: ["id", "name"],
                    }).then((authors) => {
                        models.Genre.findAll({
                            attributes: ["id", "name"],
                            raw: true,
                        }).then((genres) => {
                            let genresMapped = genres.map((genre) => genre.name);
                            models.Tag.findAll({
                                attributes: ["id", "name"],
                                raw: true,
                            }).then((tags) => {
                                let tagsMapped = tags.map((tag) => tag.name);
                                let filters = [];
                                for (let a of filterIds.authors) {
                                    filters.push({
                                        id: a,
                                        name: findName(authors, a),
                                        type: "Author",
                                    });
                                }
                                for (let g of filterIds.genres) {
                                    filters.push({
                                        id: g,
                                        name: findName(genres, g),
                                        type: "Genre",
                                    });
                                }
                                for (let t of filterIds.tags) {
                                    filters.push({
                                        id: t,
                                        name: findName(tags, t),
                                        type: "Tag",
                                    });
                                }
                                res.render("index", {
                                    books: books,
                                    admin: true,
                                    authors: authors.map((a) => a.name),
                                    genres: genresMapped,
                                    tags: tagsMapped,
                                    filters: filters,
                                    user: true,
                                });
                            });
                        });
                    });
                } else {
                    res.render("index", {
                        books: books,
                        admin: false,
                        authors: [],
                        genres: [],
                        tags: [],
                        user: true,
                    });
                }
            });
        } else {
            res.render("index", {
                books: books,
                admin: false,
                authors: [],
                genres: [],
                tags: [],
                user: false,
            });
        }
    });
});

function findName(records, id) {
    for (let record of records) {
        console.log(record);
        if (record.id === id) {
            return record.name;
        }
    }
    return false;
}

router.post("/addBook", admin, (req, res) => {
    console.log(req.body.title);
    models.Author.findOrCreate({
        where: {
            name: req.body.author,
        },
    })
        .then((author, isCreated) => {
            console.log(author[0].id);
            models.Book.create({
                name: req.body.title,
                authorId: author[0].id,
                cover: req.body.cover,
            }).then((book) => {
                console.log(book);
                //generate genre and tag promises
                let promises = [];
                for (let genre of req.body.genres) {
                    promises.push(
                        models.Genre.findOrCreate({
                            where: {
                                name: genre,
                            },
                        }),
                    );
                }
                for (let tag of req.body.tags) {
                    promises.push(
                        models.Tag.findOrCreate({
                            where: {
                                name: tag,
                            },
                        }),
                    );
                }
                //execute genre and tag promises
                Promise.all(promises)
                    .then((result) => {
                        //generate associations promises
                        let promises = [];
                        for (let item of result) {
                            item = item[0];
                            if (item.constructor.name === "Genre") {
                                promises.push(
                                    models.BookGenre.create({
                                        bookId: book.id,
                                        genreId: item.id,
                                    }),
                                );
                            } else {
                                promises.push(
                                    models.BookTag.create({
                                        bookId: book.id,
                                        tagId: item.id,
                                    }),
                                );
                            }
                        }
                        //execute associations promises
                        Promise.all(promises)
                            .then((result) => {
                                console.log("Complete");
                                console.log(result);
                                res.sendStatus(200);
                            })
                            .catch((err) => {
                                //error
                                console.error(err);
                            });
                    })
                    .catch((err) => {
                        //error
                        console.error(err);
                    });
            });
        })
        .catch((err) => {
            //error
            console.error(err);
        });
});

router.get("/book", (req, res) => {
    req.session.userId = "5885200d-51c0-418d-ae84-374e880fe0c4";
    if (req.query.id) {
        models.Book.findOne({
            where: {
                id: req.query.id,
            },
            include: [
                {
                    model: models.Author,
                    attributes: ["name", "id"],
                },
                {
                    model: models.Genre,
                    attributes: ["name", "id"],
                },
                {
                    model: models.Tag,
                    attributes: ["name", "id"],
                },
            ],
        })
            .then((book) => {
                console.log(book.cover);
                if (req.session && req.session.userId) {
                    models.User.findOne({
                        where: {
                            id: req.session.userId,
                        },
                        attributes: ["permissions"],
                    })
                        .then((user) => {
                            if (user.permissions === "admin") {
                                models.Author.findAll({
                                    attributes: ["id", "name"],
                                }).then((authors) => {
                                    models.Genre.findAll({
                                        attributes: ["id", "name"],
                                        raw: true,
                                    }).then((genres) => {
                                        let genresMapped = genres.map((genre) => genre.name);
                                        models.Tag.findAll({
                                            attributes: ["id", "name"],
                                            raw: true,
                                        }).then((tags) => {
                                            let tagsMapped = tags.map((tag) => tag.name);
                                            res.render("book", {
                                                book: book,
                                                admin: true,
                                                authors: authors.map((a) => a.name),
                                                genres: genresMapped,
                                                tags: tagsMapped,
                                                user: true,
                                            });
                                        });
                                    });
                                });
                            } else {
                                res.render("book", {
                                    book: book,
                                    admin: false,
                                    user: true,
                                });
                            }
                        })
                        .catch((err) => {
                            res.render("book", {
                                book: book,
                                admin: false,
                                user: false,
                            });
                        });
                } else {
                    res.render("book", {
                        book: book,
                        admin: false,
                        user: false,
                    });
                }
            })
            .catch((err) => {
                res.render("bookNotFound", {
                    err: sendErr(err),
                });
            });
    } else {
        res.redirect("/");
    }
});

router.post("/editBook", admin, (req, res) => {
    if (!req.body.title || !req.body.author || !req.body.id || !req.body.blurb) {
        //error
        res.send("Need name, author, id, blurb");
    }
    models.Author.findOrCreate({
        where: {
            name: req.body.author,
        },
    })
        .then((author, isCreated) => {
            models.Book.findOne({
                where: {
                    id: req.body.id,
                },
            })
                .then((book) => {
                    if (req.body.title) {
                        book.name = req.body.title;
                    }
                    if (req.body.blurb) {
                        book.blurb = req.body.blurb;
                    }
                    if (req.body.author && author[0].id) {
                        book.authorId = author[0].id;
                    }
                    if (req.body.notes || req.body.notes === "") {
                        book.notes = req.body.notes;
                    }
                    if (req.body.cover || req.body.cover === "") {
                        book.cover = req.body.cover;
                    }
                    if (req.body.isbn || req.body.isbn === "") {
                        book.isbn = req.body.isbn;
                    }
                    if (req.body.link || req.body.link === "") {
                        book.link = req.body.link;
                    }
                    console.log(req.body);
                    console.log(book);
                    book.save()
                        .then((dbBook) => {
                            //generate genre and tag promises
                            let promises = [];
                            promises.push(
                                models.BookGenre.destroy({
                                    where: {
                                        bookId: book.id,
                                    },
                                }),
                                models.BookTag.destroy({
                                    where: {
                                        bookId: book.id,
                                    },
                                }),
                            );
                            for (let genre of req.body.genres) {
                                promises.push(
                                    models.Genre.findOrCreate({
                                        where: {
                                            name: genre,
                                        },
                                    }),
                                );
                            }
                            for (let tag of req.body.tags) {
                                promises.push(
                                    models.Tag.findOrCreate({
                                        where: {
                                            name: tag,
                                        },
                                    }),
                                );
                            }
                            //execute genre and tag promises
                            Promise.all(promises)
                                .then((result) => {
                                    //generate associations promises
                                    let promises = [];
                                    let genres = {};
                                    let tags = {};
                                    for (let item of result) {
                                        item = item[0];
                                        if (item) {
                                            if (item.constructor.name === "Genre") {
                                                promises.push(
                                                    models.BookGenre.findOrCreate({
                                                        where: {
                                                            bookId: book.id,
                                                            genreId: item.id,
                                                        },
                                                    }),
                                                );
                                                genres[item.name] = item.id;
                                            } else {
                                                promises.push(
                                                    models.BookTag.findOrCreate({
                                                        where: {
                                                            bookId: book.id,
                                                            tagId: item.id,
                                                        },
                                                    }),
                                                );
                                                tags[item.name] = item.id;
                                            }
                                        }
                                    }
                                    //execute associations promises
                                    Promise.all(promises)
                                        .then((result) => {
                                            console.log("Complete");
                                            console.log(result);
                                            let data = {
                                                author: book.authorId,
                                                genres: genres,
                                                tags: tags,
                                            };
                                            res.status(200).send(JSON.stringify(data));
                                        })
                                        .catch((err) => {
                                            //error
                                            console.error(err);
                                        });
                                })
                                .catch((err) => {
                                    //error
                                    console.error(err);
                                });
                        })
                        .catch((err) => {
                            //error
                            console.error(err);
                        });
                })
                .catch((err) => {
                    //error
                    console.error(err);
                });
        })
        .catch((err) => {
            //error
            console.error(err);
        });
});

router.post("/deleteBook", admin, (req, res) => {
    if (req.body.id) {
        models.Book.destroy({
            where: {
                id: req.body.id,
            },
        })
            .then((rowsDeleted) => {
                if (rowsDeleted >= 1) {
                    res.sendStatus(200);
                } else {
                    //error
                    console.error("No row deleted");
                }
            })
            .catch((err) => {
                //error
                console.error(err);
            });
    } else {
        //error
        console.error("No book id provided");
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    console.log(req.body.username);
    models.User.findOne({
        where: {
            username: req.body.username,
        },
    })
        .then((user) => {
            if (user === null) {
                res.status(401).send("Incorrect credentials");
            } else {
                bcrypt.compare(req.body.password, user.password, (err, match) => {
                    if (err) {
                        res.status(500).send({ message: `Error${sendErr(err.message)}. Please try again later` });
                    } else {
                        if (match) {
                            req.session.userId = user.id;
                            res.status(200).send("Success");
                        } else {
                            res.status(401).send("Incorrect credentials");
                        }
                    }
                });
            }
        })
        .catch((err) => {
            res.status(500).send(`Error${sendErr(err.message)}. Please try again later`);
        });
});

router.post("/logout", (req, res) => {
    try {
        req.session.destroy();
        res.send("Success");
    } catch (err) {
        res.send(`Error${sendErr(err.message)}. Please try again`);
    }
});

module.exports = router;
