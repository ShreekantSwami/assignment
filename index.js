const PORT = 1403;
const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();

// Use the ejs view engine
app.set("view engine", "ejs");

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// MongoDB connection URL
// const url = "mongodb://localhost:27017/";
const url =
  "mongodb+srv://shree20012018:853742691@login.nb3ko.mongodb.net/?retryWrites=true&w=majority&appName=login";

const client = new MongoClient(url);

// Function to connect to MongoDB once during server startup
async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process if MongoDB can't be connected
  }
}

// Call the function to establish the connection at startup
connectToDB();

// Route to display products
app.get("/", async (req, res) => {
  try {
    const db = client.db("ejs");
    const collection = db.collection("products");
    const data = await selectProducts(collection);
    res.render("pages/show.ejs", { data });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to render addProduct form
app.get("/addProduct", (req, res) => {
  res.render("pages/addProduct.ejs");
});

// Route to handle adding a new product
app.post("/addProduct", async (req, res) => {
  try {
    const { prid, pname, category, price, stock } = req.body;
    const db = client.db("ejs");
    const collection = db.collection("products");
    const data = {
      pid: prid,
      pname: pname,
      category: category,
      price: price,
      stock: stock,
    };

    const result = await collection.insertOne(data);
    console.log("Product added:", result);

    // Redirect to the homepage after adding the product
    res.redirect("/");
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send("Error adding product");
  }
});

// Function to fetch all products from the database
const selectProducts = async (collection) => {
  const result = await collection.find({}).toArray();
  return result;
};

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is listening on the PORT ${PORT}`);
});
