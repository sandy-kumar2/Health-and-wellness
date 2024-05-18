const express = require('express');
const Notes = require('../models/Notes');
const router = express.Router();
var fetchuser= require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//Route 1:Get all the notes from the data base "/api/notes/getuser"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    } catch(error)
    {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title.').isLength({ min: 5 }),
    body('description', 'Description must be minimum 5 character.').isLength({ min: 5 }),],
    async (req, res) => { 
        const{title, description, tag} = req.body;

        //If there are errors, return bad reqest and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
        }
        try{
            const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
            })
            const saveNote = await note.save()

            res.json(saveNote);
        } catch(error)
        {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        } 
    })

//Route3: Update an existing Note using: Post "api/notes/updateNote", login required
router.put('/updatenote/:id', fetchuser, async(req, res)=> {
    const {title, description,tag} = req.body;

    try {
        //create a new Note object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(401).send("Not found")}

        if(note.user.toString() !== req.user.id)
        {
           return res.status(401).send("not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note});
        } catch(error)
        {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }   
})

//Route3: Delete an existing Note using: Post "api/notes/updateNote", login required
router.delete('/deletenote/:id', fetchuser, async(req, res) => {
    try{
        //Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        //Allow deletion only if user owns this note
        if(note.user.toString() !== req.user.id)
        {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been delete", note: note});
    } catch (error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router