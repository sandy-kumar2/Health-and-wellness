import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const[notes, setNotes] = useState(notesInitial);

    const getNotes = async ()=> {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
            },
        });
        const json = await response.json();
        setNotes(json);
    }

    const addNote = async (title, description, tag)=> {
        const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        },
          body: JSON.stringify({title, description, tag}), 
        });

        const note = await response.json();
        setNotes(notes.concat(note));
    }

    const deleteNote = async (id) => {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
           method: "DELETE", 
           headers: {
           "Content-Type": "application/json",
           "auth-token": localStorage.getItem('token')
           },
        });
        const json = response.json();
        const newNotes = notes.filter((note)=>{return note._id !== id});
        setNotes(newNotes); 
    }

    const editNote = async (id, description, tag, title) => {
           const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
           method: "PUT", 
           headers: {
          "Content-Type": "application/json",
          "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjYzNWZkZDNjODNlNmEyMGQwZWFhZDRkIn0sImlhdCI6MTcxNDgyOTczMX0.jmliCZfIrBCYO5z-PViXqF5fX7NiFtoQ0GT-_RNWDGw"
        },
          body: JSON.stringify({title, description, tag}), 
        });
        const json = response.json();

        for(let index = 0; index < notes.length; index++)
        {
            const element = notes[index];
            if(element._id === id)
            {
               notes[index].title = title;
               notes[index].description = description;
               notes[index].tag = tag;
            }
            break;
        }
        setNotes(notes);
    }

return (
    <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
        {props.children}
    </NoteContext.Provider>
    )
}

export default NoteState;