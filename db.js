
const MongoClient = require('mongodb').MongoClient;


exports.getDB = (callback) => {
    // Connection URL
    const url = "mongodb+srv://helgaadmin:tipho9-vucHyf-dypcyw@cluster0-yvlf3.mongodb.net/test?retryWrites=true";

    // Database Name
    const dbName = 'jeu';

    const client = new MongoClient(url, { useNewUrlParser: true });

    client.connect((err) => {
       
        if (err) {
            console.log('mongo connection error: ' +err);
        }
        console.log("Connected successfully to atlas server");

        const db = client.db(dbName);
        callback(db, () => {
            client.close();
            console.log("connection Mongo client closed");
        });
    });
};
