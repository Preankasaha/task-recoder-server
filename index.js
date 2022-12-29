const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
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

    app.post('/addtasks', async (req, res) => {
      const tasks = req.body;
      const result = await taskCollection.insertOne(tasks);
      res.send(result);
    });
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