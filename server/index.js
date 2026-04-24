const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/Productroutes");
    
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
}   );

mongoose.connect("mongodb+srv://kartikey:google@cluster0.gnsjvvt.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error:", err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});