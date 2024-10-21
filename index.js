const express=require("express");
const cors=require("cors"); 

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app=express();
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_SECRET}@cluster0.1kugq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
   // const userCollection = client.db("usersDbBootcamp").collection("users");
    const categoryCollection = client.db("ProductDB").collection("Category");

// Category
app.get("/getcategory", async (req, res) => {
    const query = categoryCollection.find();
    const result = await query.toArray();
    res.send(result);
  }); 

  app.post("/addcategory", async (req, res) => {
    const category = req.body;
    console.log(category);
    const result = await categoryCollection.insertOne(category);
    res.send(result);
  });

  app.get("/categoryadmin/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await categoryCollection.findOne(query);
    console.log(result);
    res.send(result);
  });

  app.delete("/categorydelete/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await categoryCollection.deleteOne(query); 
    res.send(result); 
  });

  app.put("/categoryedit/:id", async (req, res) => { 
    const id = req.params.id;
    const user = req.body;
    console.log(id, user);

    const filter = { _id: new ObjectId(id) };
    const option = { upsert: true };

    const updatedUser = {
      $set: {
        name: user.name,
        photo: user.photo, 
      },
    };
    const result = await categoryCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    // Product query

    const productCollection = client.db("ProductDB").collection("Products");  

app.get("/getproduct", async (req, res) => {
  const query = productCollection.find();
  const result = await query.toArray();
  res.send(result);
}); 

app.post("/addproduct", async (req, res) => {
  const product = req.body;
  console.log(product);
  const result = await productCollection.insertOne(product);
  res.send(result);
});

app.get("/productadmin/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = { _id: new ObjectId(id) };
  const result = await productCollection.findOne(query);
  console.log(result);
  res.send(result);
});

app.delete("/productdelete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = { _id: new ObjectId(id) };
  const result = await productCollection.deleteOne(query); 
  res.send(result); 
});

app.put("/productedit/:id", async (req, res) => { 
  const id = req.params.id;
  const user = req.body;
  console.log(id, user);

  const filter = { _id: new ObjectId(id) };
  const option = { upsert: true };

  const updatedUser = {
    $set: {
      name: user.name,
      photo: user.photo, 
      category:user.category,
    },
  };
  const result = await productCollection.updateOne(
      filter,
      updatedUser,
      option
    );
    res.send(result);
  });



//user

    app.get("/users", async (req, res) => {
      const query = userCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      console.log(users);
      const result = await userCollection.insertOne(users);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);

      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch((error)=>{
    console.log(error);
});


app.get('/', (req,res)=>{
    res.send("Server assignment 5 running");
});

app.listen(port,()=>{
    console.log("Server assignment 5 running")
});