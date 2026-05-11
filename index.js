const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // await client.db("admin").command({ ping: 1 });

    const db = client.db("e-commerce");
    const productsCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/products/:productId", async (req, res) => {
      const productId = req.params.productId;

      const query = { _id: new ObjectId(productId) };

      const result = await productsCollection.findOne(query);

      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;

      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
      console.log(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
