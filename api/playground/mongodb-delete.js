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

    // deleteMany

    db.collection('Todos').deleteMany({text: "Eat lunch"}).then((result) => {
        console.log(result);
        // Note result here is CommandResult object.
    });

    // deleteOne
    db.collection('Todos').deleteOne({text: "Something"}).then((result) => {
        console.log(result);
        // Note result here is CommandResult object.
    });

    // findOneAndDelete

    db.collection('Todos').findOneAndDelete({text: 'Eat lunch'}).then((document) => {
        console.log('NOTE: Method .findOneAndDelete returns found document');
        // This is VERY handy as you have deleted object ad hoc and can quickly implement undo
        console.log(JSON.stringify(document, undefined, 2));
    }, (error) => {
        console.log('Unable to fetch Todos', error);
    });

    db.close();
    // For Mongo 3 replace:
    // db.close() with client.close()
});