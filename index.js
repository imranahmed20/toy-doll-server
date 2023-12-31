const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9qf7kmv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();


        const categoriesCollection = client.db('dollToy').collection('category')
        const orderCollection = client.db('dollToy').collection('orders')

        // Get Part

        app.get('/categories', async (req, res) => {
            const query = { category: "Baby Dolls" }
            const cursor = categoriesCollection.find(query)
            const category = await cursor.toArray()
            res.send(category)
        })

        // post part

        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders)
            res.send(result)
        })

        // Get part

        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const cursor = orderCollection.find(query).sort({ price: 1 }).limit(20)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/barbie', async (req, res) => {
            const query = { category: "Barbie Doll" }
            const cursor = categoriesCollection.find(query)
            const category = await cursor.toArray()
            res.send(category)
        })
        app.get('/americans', async (req, res) => {
            const query = { category: "American girl Doll" }
            const cursor = categoriesCollection.find(query)
            const category = await cursor.toArray()
            res.send(category)
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoriesCollection.findOne(query)
            res.send(result)
        })
        app.get('/barbie/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoriesCollection.findOne(query)
            res.send(result)
        })
        app.get('/americans/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoriesCollection.findOne(query)
            res.send(result)
        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await orderCollection.findOne(query)
            res.send(result)
        })


        //    put part

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            console.log(id, updateOrder)
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateUser = {
                $set: {
                    name: updateOrder.name,
                    sellerName: updateOrder.sellerName,
                    email: updateOrder.email,
                    photo: updateOrder.photo,
                    quantity: updateOrder.quantity,
                    rating: updateOrder.rating,
                    price: updateOrder.price,
                    detail: updateOrder.detail,
                    price: updateOrder.price
                }
            }
            const result = await orderCollection.updateOne(filter, updateUser, options)
            res.send(result)
        })


        // Delete part
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete id', id)
            const query = { _id: new ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Toy Doll Running ')
})


app.listen(port, () => {
    console.log(`Toy Doll Running on port ${port}`)
})