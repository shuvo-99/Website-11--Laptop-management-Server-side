const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.foyjr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const iCollection = client.db("laptop_management").collection("management");
    const rCollection = client.db("laptop_management").collection("reviews");

    // Items
    app.get("/item", async (req, res) => {
      const query = {};
      const cursor = iCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    // Reviews
    app.get("/review", async (req, res) => {
      const query1 = {};
      const cursor = rCollection.find(query1);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await iCollection.findOne(query);
      res.send(item);
    });

    // POST;
    app.post("/item", async (req, res) => {
      const newItem = req.body;
      const result = await iCollection.insertOne(newItem);
      res.send(result);
    });

    // DELETE
    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await iCollection.deleteOne(query);
      res.send(result);
    });

    // Update quantity
    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedUser.quantity,
        },
      };
      const result = await iCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Run laptop");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
