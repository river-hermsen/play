const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");

const app = express();

app.use(express.json()); //Used to parse JSON bodies

// DB CONFIG
const db = require("./config/keys").mongoURI;
console.log(db);

// Connect to MongoDB
mongoose
    .connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


//Use routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));
