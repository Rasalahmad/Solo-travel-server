const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8tsl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();

        const database = client.db("Tourism");
        const placeCollection = database.collection("Places");

        app.post('/addEvent', async (req, res) => {
            const place = req.body;
            const result = await placeCollection.insertOne(place);
            res.send(result);
        });

        app.get('/services', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        })

        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId (id)}
            const result = await placeCollection.deleteOne(query)
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }


}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Connected the server');
})


app.listen(port, () => {
    console.log('Server is running at port ', port);
})
