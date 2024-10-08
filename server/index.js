const express = require("express"); 
const mongoose = require("mongoose"); 
const dotenv = require("dotenv"); 
const helmet = require("helmet"); 
const morgan = require("morgan"); 
const cors = require("cors");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth"); 
const paymentRoute = require("./routes/payments"); 
const resourceRoute = require("./routes/resources");
const ngoRoute = require("./routes/ngo");

dotenv.config();

const app = express();

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToMongo();

// Middleware
app.use(express.json()); 
app.use(helmet()); 
app.use(morgan("common")); 
app.use(cors({
  origin: "*", 
  credentials: true, 
}));

// Define API routes
app.use("/api/auth", authRoute); 
app.use("/api/users", userRoute); 
app.use("/api/payments", paymentRoute); 
app.use("/api/resources", resourceRoute); 
app.use("/api/ngo", ngoRoute);

// Start the server
app.listen(8000, () => {
  console.log("Backend server is running on port 8000!");
});
