const express = require("express");
const path = require("path");
const app = express();

// Set the port based on environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, "src")));

// All routes that don't match files should serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
