'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Pledge() {
    const [sponsors, setSponsors] = useState([]);
    const [children, setChildren] = useState([]);
    const [sponsorships, setSponsorships] = useState([]);
    const [visible, setVisible] = useState(false);
    const [paymentVisible, setPaymentVisible] = useState(false);  // State for payment dialog
    const [newPledge, setNewPledge] = useState({
        sponsor_id: '',
        child_id: '',
        pledged_amount: ''
    });
    const [paymentData, setPaymentData] = useState({
        sponsorship_id: '',
        amount_paid: ''
    });

    useEffect(() => {
        // Fetch Sponsors
        fetch(`${BASE_URL}/sponsors`)
            .then(response => response.json())
            .then(data => setSponsors(data));

        // Fetch Children
        fetch(`${BASE_URL}/children`)
            .then(response => response.json())
            .then(data => setChildren(data));

        // Fetch Existing Sponsorships
        fetch(`${BASE_URL}/sponsorships`)
            .then(response => response.json())
            .then(data => setSponsorships(data));
    }, []);

    const handleInputChange = (e) => {
        // For Dropdown components
        if (e.target && e.target.name) {
            // Regular input handling
            const { name, value } = e.target;
            setNewPledge(prev => ({ ...prev, [name]: value }));
        } else {
            // Dropdown handling
            const name = e.originalEvent.target.name;
            const value = e.value;
            setNewPledge(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePaymentInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    const savePledge = () => {
        // Validate input before making POST request
        const { sponsor_id, child_id, pledged_amount } = newPledge;
        
        if (!sponsor_id || !child_id || !pledged_amount) {
            alert('Please fill in all fields');
            return;
        }

        const pledgePayload = {
            sponsor_id: parseInt(sponsor_id, 10),
            child_id: parseInt(child_id, 10),
            pledged_amount: parseFloat(pledged_amount)
        };

        fetch(`${BASE_URL}/pledge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pledgePayload),
        })
            .then(response => response.json())
            .then(data => {
                setSponsorships([...sponsorships, data]);
                setVisible(false);
                setNewPledge({ sponsor_id: '', child_id: '', pledged_amount: '' });
            })
            .catch((error) => console.error('Error adding pledge:', error));
    };

    const makePayment = () => {
        const { sponsorship_id, amount_paid } = paymentData;
        
        if (!sponsorship_id || !amount_paid) {
            alert('Please fill in all fields');
            return;
        }

        const paymentPayload = {
            sponsorship_id: parseInt(sponsorship_id, 10),  // Ensure sponsorship_id is an integer
            amount_paid: parseFloat(amount_paid)  // Ensure amount_paid is a float
        };

        fetch(`${BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentPayload),
        })
            .then(response => response.json())
            .then(data => {
                setSponsorships(sponsorships.map(s => s.sponsorship_id === data.sponsorship_id ? data : s));  // Update sponsorship list with payment info
                setPaymentVisible(false);  // Close payment dialog
                setPaymentData({ sponsorship_id: '', amount_paid: '' });  // Reset payment form
            })
            .catch((error) => console.error('Error processing payment:', error));
    };

    return (
        <div>
            <Button label="Add Pledge" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Add Pledge" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <Dropdown
                    name="sponsor_id"
                    value={newPledge.sponsor_id}
                    options={sponsors}
                    onChange={handleInputChange}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select Sponsor"
                />
                <Dropdown
                    name="child_id"
                    value={newPledge.child_id}
                    options={children}
                    onChange={handleInputChange}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select Child"
                />
                <input
                    type="number"
                    name="pledged_amount"
                    placeholder="Pledged Amount"
                    value={newPledge.pledged_amount}
                    onChange={handleInputChange}
                />
                <Button label="Save" icon="pi pi-save" onClick={savePledge} />
            </Dialog>

            {/* Payment Dialog */}
            <Dialog header="Make Payment" visible={paymentVisible} style={{ width: '50vw' }} onHide={() => setPaymentVisible(false)}>
                <Dropdown
                    name="sponsorship_id"
                    value={paymentData.sponsorship_id}
                    options={sponsorships}
                    onChange={handlePaymentInputChange}
                    optionLabel="sponsor_name"
                    optionValue="sponsorship_id"
                    placeholder="Select Sponsorship"
                />
                <input
                    type="number"
                    name="amount_paid"
                    placeholder="Amount Paid"
                    value={paymentData.amount_paid}
                    onChange={handlePaymentInputChange}
                />
                <Button label="Pay" icon="pi pi-check" onClick={makePayment} />
            </Dialog>

            <DataTable value={sponsorships} tableStyle={{ minWidth: '50rem' }}>
                <Column field="sponsor_name" header="Sponsor Name"></Column>
                <Column field="child_name" header="Child Name"></Column>
                <Column field="pledged_amount" header="Pledged Amount"></Column>
                <Column field="paid_amount" header="Paid Amount"></Column>
                <Column field="status" header="Status"></Column>
                <Column
                    body={(rowData) => (
                        <Button label="Make Payment" icon="pi pi-dollar" onClick={() => { 
                            setPaymentVisible(true); 
                            setPaymentData({ ...paymentData, sponsorship_id: rowData.sponsorship_id });
                        }} />
                    )}
                ></Column>
            </DataTable>
        </div>
    );
}
