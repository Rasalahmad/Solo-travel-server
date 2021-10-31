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
        const ordersCollection = client.db("Tourism").collection("Orders");
        const popularCollection = client.db("Tourism").collection("popular");

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

        app.get('/popular', async (req, res) => {
            const cursor = popularCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        })

        app.post("/addOrders", (req, res) => {
            ordersCollection.insertOne(req.body).then((result) => {
                res.send(result);
            });
        });

        app.get("/myOrders/:email", (req, res) => {
            console.log(req.params);
            ordersCollection
                .find({ email: req.params.email })
                .toArray((err, results) => {
                    res.send(results);
                });
        });

        app.get('/allBook', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: id }
            const result = await ordersCollection.deleteOne(query)
            res.json(result);
        })


        // delete event

        app.delete("/allBook/:id", async (req, res) => {
            // console.log(req.params.id);
            const result = await ordersCollection.deleteOne({
                _id: req.params.id,
            });
            res.send(result);
        });

        // update pending
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            console.log('qery', query)
            const result = await ordersCollection.updateOne(query, {
                $set: {
                    status: 'Approved'
                }
            })
            console.log(result);
            // const filter = { _id: ObjectId(id) };
        
            // ordersCollection
            //   .updateOne(filter, {
            //     $set: {
            //       status: updatedName.status,
            //     },
            //   })
            //   .then((result) => {
            //     res.send(result);
            //   });
          });

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
