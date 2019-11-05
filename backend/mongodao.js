function MongoDao(mongoUri, dbname) {
    var _this = this;
    var options = {
        useNewUrlParser: true
    };
    _this.mongoClient = new MongoClient(mongoUri, options);
    return new Promise(function(resolve, reject) {
        _this.mongoClient.connect(function(err, client) {
            assert.equal(err, null);
            console.log("mongo client successfully connected \n");
            _this.dbConnection = _this.mongoClient.db(dbname);
            resolve(_this);
        });
    });

  
}


async function main() {
    mongoDao = await new MongoDao(url, dbName);
    insertFn();
}

main();

const insertFn = function() {
    //insert and then inserted record will be read
    mongoDao.insertDocument(collectionName, doc, updateFn);
}

MongoDao.prototype.insertDocument = function(collectionName, doc, callback) {
    var _this = this;
    this.dbConnection.collection(collectionName).insertOne(doc, function(err, result) {
        assert.equal(null, err);
        console.log(" Below doc inserted successfully");
        _this.printDocument(collectionName, doc, callback);
    });
}


MongoDao.prototype.printDocument = function(collectionName, doc, callback) {
    this.dbConnection.collection(collectionName).find({}).filter(doc)
        .toArray(function(err, docs) {
            console.log(docs[0]);
            console.log("\n");
            callback();
        });
}

const updateFn = function() {
    var updateDoc = {
        "$set": {
            "mobile": 9629230494
        }
    };
    mongoDao.updateDocument(collectionName, doc, updateDoc, deleteFn);
}