const express = require('express')
require('dotenv').config()
const { MongoClient } = require('mongodb');
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
      // explore get
      app.get('/explore', async (req, res) => {
          const cursor = exploreCollection.find({});
          const explore = await cursor.toArray();
          res.send(explore)
      })

      // explore post 
      app.post('/explore', async(req, res) => {
          const explo = req.body;
          const result = await exploreCollection.insertOne(explo)
          res.json(result)
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