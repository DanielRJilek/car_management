import {MongoClient} from "mongodb";

let client;

export const connectDB = () => {
    try {
        client = new MongoClient(process.env.DATABASE_URI);
        client.connect();
        return client;
    }
    catch (err) {
        console.log(err);
    }
}

export const getDB = () => {
    if (!client) {
        client = connectDB();
    }
    return client.db("dev");
}