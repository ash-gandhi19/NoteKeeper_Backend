const router = require("express").Router();
let Note = require("../models/notesModel");
const User = require("../models/usersModel");

// Get all
router.route("/").get((req, res) => {
  Note.find()
    .then((note) => res.json(note))
    .catch((err) => res.status(400).json("Error :" + err));
});

// Get all notes per user
router.route("/:userId").get((req, res) => {
  Note.findOne({
    userId: req.params.userId,
  })
    .then((notes) => {
      if (notes) {
        res.json(notes);
      } else {
        res.json("Notes not found!");
      }
    })
    .catch((err) => res.status(400).json("Error : " + err));
});

// Add
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const notes = [];

  const newNotes = new Note({
    userId,
    notes,
  });

  newNotes
    .save()
    .then((note) => res.json("New Notes Added!"))
    .catch((err) => res.status(400).json("Error :" + err));
});

// Update
router.route("/update").post((req, res) => {
  const userId = req.body.userId;
  const notes = req.body.notes;

  Note.findOneAndUpdate(
    {
      userId: userId,
    },
    {
      $set: {
        notes: notes,
      },
    }
  ).then((note) =>
    note ? res.json("Notes successfully updated!") : res.status(400).json("Notes not found")
  )
  .catch((err) => res.status(400).json("Error : " + err));
});


// Push notes

router.route("/addNote").post((req, res) => {
  const userId = req.body.userId;

  const note = {
    title: req.body.title,
    content: req.body.content,
  };

  Note.findOneAndUpdate(
    {
      userId: userId,
    },
    {
      $push: {
        notes: note,
      },
    }
  )
    .then((notes) => {
      if (notes) {
        res.json("Note successfully added!");
      } else {
        res.json("Notes not found");
      }
    })
    .catch((err) => res.status(400).json("Error : " + err));
});

module.exports = router;
