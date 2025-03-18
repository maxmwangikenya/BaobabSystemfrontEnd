'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Child() {
    const [children, setChildren] = useState([]);
    const [visible, setVisible] = useState(false);
    const [newChild, setNewChild] = useState({ name: '', age: '' });

    useEffect(() => {
        fetch(`${BASE_URL}/children`)
            .then(response => response.json())
            .then(data => setChildren(data));
    }, []); // Added empty dependency array to avoid infinite loop

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChild({ ...newChild, [name]: value });
    };

    const saveChild = () => {
        // Validate input before making POST request
        if (!newChild.name || !newChild.age) {
            alert('Please fill in both fields');
            return;
        }

        // Send POST request to add child
        fetch(`${BASE_URL}/children`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newChild),
        })
            .then(response => response.json())
            .then(data => {
                setChildren([...children, data]); // Add new child to the table
                setVisible(false); // Close the dialog
                setNewChild({ name: '', age: '' }); // Reset the form
            })
            .catch((error) => {
                console.error('Error adding child:', error);
            });
    };

    return (
        <div>
            <Button label="Add Child" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Add Child" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newChild.name}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={newChild.age}
                    onChange={handleInputChange}
                />
                <Button label="Save" icon="pi pi-save" onClick={saveChild} />
            </Dialog>
            <DataTable value={children} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Name"></Column>
                <Column field="age" header="Age"></Column>
            </DataTable>
        </div>
    );
}
