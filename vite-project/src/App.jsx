import React, { useState, useEffect } from 'react';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editNoteId, setEditNoteId] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:2137/api/notes');
            const data = await response.json();
            console.log(data);
            console.log(response);
            setNotes(data);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    };

    const createNote = async () => {
        try {
            const response = await fetch('http://localhost:2137/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });
            const data = await response.json();
            setNotes([...notes, data]);
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    };

    const updateNote = async (id) => {
        try {
            const response = await fetch(`http://localhost:2137/api/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });
            const data = await response.json();
            setNotes(notes.map(note => (note._id === id ? data : note)));
            setEditNoteId(null);
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Failed to update note:', error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await fetch(`http://localhost:2137/api/notes/${id}`, {
                method: 'DELETE',
            });
            setNotes(notes.filter(note => note._id !== id));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const handleEdit = (note) => {
        setEditNoteId(note._id);
        setTitle(note.title);
        setContent(note.content);
    };

    return (
        <div>
            <h1>Notatki</h1>
            <div>
                <input
                    type="text"
                    placeholder="Tytuł"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Treść"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                {editNoteId ? (
                    <button onClick={() => updateNote(editNoteId)}>Zaktualizuj notatkę</button>
                ) : (
                    <button onClick={createNote}>Dodaj notatkę</button>
                )}
            </div>
            <ul>
                {notes.map((note) => (
                    <li key={note._id}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <button onClick={() => handleEdit(note)}>Edytuj</button>
                        <button onClick={() => deleteNote(note._id)}>Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
