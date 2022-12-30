const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fwkvzgi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

async function run() {
  try {
    const taskCollection = client.db('taskmanageDB').collection('task');


    app.get('/tasks', async (req, res) => {
      const query = {};
      const allTasks = await taskCollection.find(query).toArray();
      res.send(allTasks);
    })

    app.get('/tasks/:email', async (req, res) => {
      const user = req.params.email;
      const status = req.query.status;
      const query = {
        email: user,
        status: status,
      };
      const allTasks = await taskCollection.find(query).toArray();
      res.send(allTasks);
    })

    app.post('/addtasks', async (req, res) => {
      const tasks = req.body;
      const result = await taskCollection.insertOne(tasks);
      res.send(result);
    });

    // complete put api
    app.put('/updatetask/:id', async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {
        $set: updatedTask
      }
      const result = await taskCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    // ask delete api
    app.delete('/deleted/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(filter)
      res.send(result);
    })
  }
  finally {

  }
}
run().catch(err => console.error)

app.get('/', (req, res) => {
  res.send('hello from server')
})
app.listen(port, () => {
  console.log(`listening to port ${port}`);
})