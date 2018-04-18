const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    // For Mongo 3 replace:
    // (err, db) with (err, client)
    if (err) {
        // Use of return statement stops execution of code underneath
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // For Mongo 3 add line:
    // const db = client.db(TodoApp);

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5ad65e45212fa5042c1ca236')
    }, {
        $set: {
            text: "Updated from Node",
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => console.log(result));

    db.close();
    // For Mongo 3 replace:
    // db.close() with client.close()
});