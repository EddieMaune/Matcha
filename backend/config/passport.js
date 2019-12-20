const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient
const keys = require("./keys");
const opts = {};
let db = null;

MongoClient.connect("mongodb://localhost:27017/matcha", { useUnifiedTopology: true }, function(err, client) {
  if(err) return console.error(err);

  db = client.db('matcha');
//   console.log(database);
  
//   console.log(db);

  // the Mongo driver recommends starting the server here because most apps *should* fail to start if they have no DB.  If yours is the exception, move the server startup elsewhere. 
});

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        db.collection("users").findOne({ _id: jwt_payload.id }, function (err, user) {
            if (err)
                throw err;
            if (user) {
                return done(null, user);
                //return res.status(400).json({ email: "Email already exists" });
            }

        });


    //   User.findById(jwt_payload.id)
    //     .then(user => {
    //       if (user) {
    //         return done(null, user);
    //       }
    //       return done(null, false);
    //     })
    //     .catch(err => console.log(err));
    })
  );
};