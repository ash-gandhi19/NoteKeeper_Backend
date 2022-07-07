const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const connectionDB = require("./dbConnection");
const UserRouter = require("./routes/usersRoute");
const NotesRouter = require("./routes/notesRoute");

var port = process.env.PORT || 5000;
app.listen(port, console.log(`server is  running ${port}`));

// --------------------------deployment------------------------------
__dirname = path.resolve();

app.get("/", (req, res) => {
  res.send("API is running..");
});
// --------------------------deployment------------------------------

// middleware
app.use(express.json());
const moargan = require("morgan");
app.use(moargan("dev"));
var cors = require("cors");
app.use(cors());

// connection of database

connectionDB()
  .then(() => console.log(`connected to database mongodb `))
  .catch((err) => console.log(`connection to database fail error is ${err}`));
app.use("/users", UserRouter);
app.use("/notes", NotesRouter);
