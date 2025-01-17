import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());

// connect to mongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/userInfo", {
    useNewUrlParser: true, // Ensures compatibility with the MongoDB connection string parser
    useUnifiedTopology: true, // Enables the new MongoDB driver connection engine
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Routes
app.get("/", (req, res) => {
  res.send("log my first response!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
