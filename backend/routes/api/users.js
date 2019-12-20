const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient
let db = null;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const keys = require("../../config/keys");

MongoClient.connect("mongodb://localhost:27017/matcha", { useUnifiedTopology: true }, function (err, client) {
    if (err) return console.error(err);

    db = client.db('matcha');
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
                        res.json(newUser);
                    });
                });


            });

        });
    }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    // Find user by email

    db.collection("users").findOne({ email: req.body.email }, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            return res.status(400).json({ emailnotfound: "User does not exist" });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
              // User matched
              // Create JWT Payload
              const payload = {
                id: user.id,
                name: user.name
              };
      // Sign token
              jwt.sign(
                payload,
                keys.secretOrKey,
                {
                  expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                }
              );
            } else {
              return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
            }
          });

    });



    // User.findOne({ email }).then(user => {
    //     // Check if user exists
    //     if (!user) {
    //         return res.status(404).json({ emailnotfound: "Email not found" });
    //     }
    //     // Check password
    //     bcrypt.compare(password, user.password).then(isMatch => {
    //         if (isMatch) {
    //             // User matched
    //             // Create JWT Payload
    //             const payload = {
    //                 id: user.id,
    //                 name: user.name
    //             };
    //             // Sign token
    //             jwt.sign(
    //                 payload,
    //                 keys.secretOrKey,
    //                 {
    //                     expiresIn: 31556926 // 1 year in seconds
    //                 },
    //                 (err, token) => {
    //                     res.json({
    //                         success: true,
    //                         token: "Bearer " + token
    //                     });
    //                 }
    //             );
    //         } else {
    //             return res
    //                 .status(400)
    //                 .json({ passwordincorrect: "Password incorrect" });
    //         }
    //     });
    // });
});

module.exports = router;