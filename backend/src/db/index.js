const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017";
const dbName = "wordgrid";

const client = new MongoClient(url, { useNewUrlParser: true });

const insertDocuments = function(db, callback) {
  const collection = db.collection("documents");
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into collection");
    callback(result);
  });
};

const updateDocument = function(db, callback) {
  const collection = db.collection("documents");

  collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("updated document with the field equal to 2");
    callback(result);
  });
};

const findDocuments = function(db, callback) {
  const collection = db.collection("documents");

  collection.find({ a: 3 }).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("found the following records");
    console.log(docs);
    callback(docs);
  });
};

const removeDocument = function(db, callback) {
  const collection = db.collection("documents");

  collection.deleteOne({ a: 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("removed the document with the field a equal to 3");
    callback(result);
  });
};

const indexCollection = function(db, callback) {
  db.collection("documents").createIndex({ a: 1 }, null, function(
    err,
    results
  ) {
    console.log(results);
    callback();
  });
};

// client.connect(function(err) {
//   assert.equal(null, err);
//   console.log("Successfully connected to server!");

//   const db = client.db(dbName);

//   insertDocuments(db, function() {
//     indexCollection(db, function() {
//       client.close();
//     });
//   });
// });

const createDbConnection = async function() {
  await client.connect();
  console.log("Successfully connected to db server");
  return client.db(dbName);
};

const closeDbConnection = async function() {
  client.close();
};

module.exports = {
  createDbConnection,
  closeDbConnection
};
