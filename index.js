const cors = require('cors');
const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// MIDDLEWARE 
app.use(cors());
app.use(express.json());





// MONGODB to server added
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqmtelq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);


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
    await client.connect();


    // node mongodb crud 
    const CoffeeCollection = client.db("coffeeDB").collection('coffee')
    // firebase er jonno
    const userCollection = client.db('coffeeDB').collection('user')

    // data receive korea er por dakhanor kaj localhost a 

    app.get('/coffee', async (req, res) => {
      const cursor = CoffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)

    })
    // update kora lagbe abar client side a 
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await CoffeeCollection.findOne(query)
      res.send(result)
    })

    // server side a updatae korea lageber 

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCoffee = req.body
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          supplier: updatedCoffee.supplier,
          category: updatedCoffee.category,
          chef: updatedCoffee.chef,
          taste: updatedCoffee.taste,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo

        }
      }
      const result = await CoffeeCollection.updateOne(filter,coffee,options)
      res.send(result)
    })

    // data receive korea first kaj .. backend a ?/
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body
      console.log(newCoffee);
      const result = await CoffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    // data delete korea kaj backend a
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await CoffeeCollection.deleteOne(query);
      res.send(result)
    })

    // user deleted apis

    app.get('/user', async (req,res)=>{
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users)
    })

    app.patch('/user', async (req,res)=>{
      const user = req.body;
      const filter = {email : user.email}
      const updateDoc = {
        $set : {
          lastLoggedAt : user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter,updateDoc);
      res.send(result)
    })


    app.post('/user',async(req,res)=>{
      const user = req.body;
      console.log(user);
      const result =  await userCollection.insertOne(user)
      res.send(result)
    })

    app.delete('/user/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId (id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);
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
  res.send('Coffee Store Running Server Side')
});


app.listen(port, () => {
  console.log(`Coffee Store Running Server Successfully ${port}`);
})