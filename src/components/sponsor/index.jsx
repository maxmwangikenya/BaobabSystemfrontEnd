'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Sponsor() {
    const [sponsors, setSponsors] = useState([]);
    const [visible, setVisible] = useState(false);
    const [newSponsor, setNewSponsor] = useState({ name: '', email: '' });

    useEffect(() => {
        fetch(`${BASE_URL}/sponsors`)
            .then(response => response.json())
            .then(data => setSponsors(data));
    }, []); // Added empty dependency array to avoid infinite loop

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSponsor({ ...newSponsor, [name]: value });
    };

    const saveSponsor = () => {
        // Validate input before making POST request
        if (!newSponsor.name || !newSponsor.email) {
            alert('Please fill in both fields');
            return;
        }

        // Send POST request to add sponsor
        fetch(`${BASE_URL}/sponsors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSponsor),
        })
            .then(response => response.json())
            .then(data => {
                setSponsors([...sponsors, data]); // Add new sponsor to the table
                setVisible(false); // Close the dialog
                setNewSponsor({ name: '', email: '' }); // Reset the form
            })
            .catch((error) => {
                console.error('Error adding sponsor:', error);
            });
    };

    return (
        <div>
            <Button label="Add Sponsor" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Add Sponsor" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newSponsor.name}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newSponsor.email}
                    onChange={handleInputChange}
                />
                <Button label="Save" icon="pi pi-save" onClick={saveSponsor} />
            </Dialog>
            <DataTable value={sponsors} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Name"></Column>
                <Column field="email" header="Email"></Column>
            </DataTable>
        </div>
    );
}

