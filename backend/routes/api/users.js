const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient
let db = null;//require('../../connection');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");


MongoClient.connect("mongodb://localhost:27017/matcha", { useUnifiedTopology: true }, function(err, client) {
  if(err) return console.error(err);

  db = client.db('matcha');
/
  // the Mongo driver recommends starting the server here because most apps *should* fail to start if they have no DB.  If yours is the exception, move the server startup elsewhere. 
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    } else {
        db.collection("users").findOne({ email: req.body.email }, function (err, user) {
            if (err)
                throw err;
            if (user) {
                return res.status(400).json({ email: "Email already exists" });
            }

            const newUser = {
                 name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                date: Date.now().toString()
            };

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;

                    db.collection('users').insertOne(newUser, function (err, r) {
                        if (err)
                            throw err;
                        if (r.insertedCount != 1)
                            console.log("ERROR: Failed to insert into database.");
                        console.log(r);
                    });
                });


            });

        });
    }
});

module.exports = router;