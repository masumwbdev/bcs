const express = require('express')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icwz7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("baby_care");
    const exploreCollection = database.collection("explore");
    const usersCollection = database.collection('users')
    const topUsersCollection = database.collection('top-users')
    // explore get
    app.get('/explore', async (req, res) => {
      const cursor = exploreCollection.find({});
      const explore = await cursor.toArray();
      res.send(explore)
    })

    app.post('/my-users', async (req, res) => {
      try{
        const email = req.body.email;
        const cursor = usersCollection.find({email: email});
        const user = await cursor.toArray();
        res.json(user)
      }
      catch{

      }
    })

    app.get('/explore/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const explo = await exploreCollection.findOne(query);
      res.json(explo)
    })

    // users get
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users)
    })

    // post users
    app.post('/users', async (req, res) => {
      const users = req.body;
      // console.log('hit users')
      const result = await usersCollection.insertOne(users);
      res.json(result);
    })

    // explore post 
    app.post('/explore', async (req, res) => {
      const explo = req.body;
      const result = await exploreCollection.insertOne(explo)
      res.json(result)
    })

    app.post('/top-users', async(req, res) => {
      const user = req.body;
      const result = await topUsersCollection.insertOne(user);
      res.json(result)
    })

    app.put('/top-users', async(req, res) => {
      const user = req.body;
      const filter = {email: user.email};
      const options = {upsert: true};
      const updateDoc = {$set: user};
      const result = await topUsersCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })

    // delete api
    app.delete('/my-users/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.json(result);
  })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})