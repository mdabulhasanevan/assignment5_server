const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// const corsConfig = {
//   origin: '',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
app.use(cors())
//app.options("", cors(corsConfig))

app.use(express.json());




//const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_SECRET}@cluster0.1kugq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//const uri = `mongodb+srv://bootcamp_db_user:ZAQ!2wsx@cluster0.1kugq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = process.env.URI;

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
    //  await client.connect();

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
      //console.log(category);
      const result = await categoryCollection.insertOne(category);
      res.send(result);
    });

    app.get("/categoryadmin/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      //console.log(result);
      res.send(result);
    });

    app.delete("/categorydelete/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/categoryedit/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      //console.log(id, user);

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

    //customer product purchase query self history user
    const productPurchaseCollection = client.db("ProductDB").collection("userPurchaseCollecting");

    app.get("/CustomerPurchaseHistorySelf/:id", async (req, res) => {  //for customer self orderd list

      const id = req.params.id; // Get the customer ID from the request parameters
      //console.log(id);

      try {
        const query = await productPurchaseCollection.aggregate([
          {
            $addFields: {
              category: { $toObjectId: "$category" } // Convert category to ObjectId
            }
          },
          {
            $match: {
              customerid: id // Filter by customerid
            }
          },
          {
            $lookup: {
              from: 'Category',
              localField: 'category', // the field in productPurchaseCollection
              foreignField: '_id',     // the field in Category collection
              as: 'categoryDetails'     // array of matched categories
            }
          },

        ]).toArray();

        res.send(query);
        //console.log(query);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch products" });
      }


    });


    app.post("/addCustomerPurchase", async (req, res) => {
      const product = req.body;
      //console.log(product);
      const result = await productPurchaseCollection.insertOne(product);
      res.send(result);
    });



    app.get("/getCustomerPurchase", async (req, res) => {
      try {
        const query = await productPurchaseCollection.aggregate([
          {
            $addFields: {
              category: { $toObjectId: "$category" } // Convert category to ObjectId
            }
          },

          {
            $lookup: {
              from: 'Category',
              localField: 'category', // the field in productPurchaseCollection
              foreignField: '_id',     // the field in Category collection
              as: 'categoryDetails'     // array of matched categories
            }
          },

        ]).toArray();

        res.send(query);
        //console.log(query);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch products" });
      }
    });

    app.delete("/deleteCustomerPurchase/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productPurchaseCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/paymentCustomerPurchase/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      //console.log(id, user);

      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updatedUser = {
        $set: {
          paymentstatus: user.paymentstatus,

        },
      };
      const result = await productPurchaseCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
      //console.log(result);
    });

    // Product query

    const productCollection = client.db("ProductDB").collection("Products");

    //user for home page and backend
    app.get("/getproduct", async (req, res) => {
      try {
        const query = await productCollection.aggregate([
          {
            $addFields: {
              category: { $toObjectId: "$category" } // Convert category to ObjectId
            }
          },
          {
            $lookup: {
              from: 'Category',
              localField: 'category', // the field in productCollection
              foreignField: '_id',    // the field in Category collection
              as: 'categoryTable'
            }
          }
        ]).toArray();
        res.send(query);
        ////console.log(query);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch products" });
      }

    });


    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      //console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.get("/productadmin/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      //console.log(result);
      res.send(result);
    });

    // app.get("/productdetail/:id", async (req, res) => {
    //   const id = req.params.id;
    //   //console.log(id);
    //   const query = { _id: new ObjectId(id) };
    //   const result = await productCollection.findOne(query);
    //   //console.log(result);
    //   res.send(result); 
    // }); 

   

    app.get("/productdetail/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id)
      try {
        // Use aggregation to retrieve the product by its _id and fetch category details
        const query = await productCollection.aggregate([
          {
            $addFields: {
              category: { $toObjectId: "$category" },
             // Convert category to ObjectId
            }
          }, 
          {
            $match: {
              _id: new ObjectId(id)// Match the specific product by its _id
            }
          },
          {
            $lookup: {
              from: 'Category',        // Ensure this matches your category collection name
              localField: 'category',   // Field in productPurchaseCollection
              foreignField: '_id',      // Field in Category collection
              as: 'categoryDetails'     // Array of matched categories
            }
          },
          {
            $unwind: {                 // Unwind categoryDetails array if you only want one category detail
              path: "$categoryDetails",
              preserveNullAndEmptyArrays: true // Allow products without a matching category
            }
          }
        ]).toArray();
    
        // Send the first item in the array (single product with category details)
        res.send(query[0]);
       // console.log("test")
      } catch (error) {
     //   console.error("Error fetching product details:", error);
        res.status(500).send({ error: "Failed to fetch product details" });
      }
    });
    

    app.get("/productlistbycategory/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);

      try {
        const query = await productCollection.aggregate([
          {
            $match: {
              category: id // Filter by category
            }
          },
          {
            $addFields: {
              category: { $toObjectId: "$category" } // Convert category to ObjectId
            }
          },
          {
            $lookup: {
              from: 'Category',
              localField: 'category', // the field in productCollection
              foreignField: '_id',    // the field in Category collection
              as: 'categoryTable'
            }
          }
        ]).toArray();
        res.send(query);
        //////console.log(query);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch products" });
      }
    });

    app.delete("/productdelete/:id", async (req, res) => {
      const id = req.params.id;
      // ////console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/productedit/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      // ////console.log(id, user);

      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updatedUser = {
        $set: {
          name: user.name,
          photo: user.photo,
          price: user.price,
          rating: user.rating,
          discription: user.discription,
          category: user.category,
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
    // Fetch all users
    const userCollection = client.db("ProductDB").collection("user");

    app.get("/users", async (req, res) => {
      const query = userCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    // Fetch a user by Firebase uid
    app.get("/user/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Add a new user to the collection
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Update user by id
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      ////console.log ({ user });
      const updatedUser = {
        $set: {
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          photoUrl: user.photoUrl,
          address: user.address,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    // Delete user by id
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // Messages Section
    // Create message
    app.post("/messages", async (req, res) => {
      const { title, message, email } = req.body;
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");

      const newMessage = {
        title,
        message,
        email,
        createdAt: new Date(),
      };

      const result = await messageCollection.insertOne(newMessage);
      res.send(result);
    });
    // Get all messages
    app.get("/messages", async (req, res) => {
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");
      const messages = await messageCollection.find().toArray();
      res.send(messages);
    });
    // Get message by id
    app.get("/messages/:id", async (req, res) => {
      const id = req.params.id;
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");
      const message = await messageCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(message);
    });



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    ////console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch((error) => {
  //console.log(error);
});


app.get('/', (req, res) => {
  res.send("Server 2024 assignment 5 running");
});

app.listen(port, () => {
  //console.log("Server 2024 assignment 5 running")
});