const express = require("express");
const connectMongoDB = require("./Db.jsx"); // Ensure the file is named correctly

const app = express();
const port = process.env.PORT || 5002;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

// Connect to MongoDB and then start the server
connectMongoDB()
  .then(() => {
    // Routes
    app.use("/api", require("./Routes/CreatUser.jsx"));
    app.use("/api", require("./Routes/DisplayData.jsx"));
    app.use("/api", require("./Routes/orderRouter.jsx")); // Add this line

    app.get("/", (req, res) => {
      res.send("Hello, Mayank this side");
    });

    app.use((req, res, next) => {
      res.status(404).send("Not Found");
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
    });

    // Start server
    app.listen(port, () => {
      console.log(`App started at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  });
