import config from "@/config";

export default {
    async registerInvoice(context, data) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const lastIdResponse = await fetch(`${config.databaseUrl}/invoices/${userId}/lastInvoiceId.json?auth=${token}`);
        const lastIdData = await lastIdResponse.json();
        
        let lastInvoiceId = Number(lastIdData) || 202500;

        const newInvoiceId = Number(lastInvoiceId + 1);
        const invoiceId = `${newInvoiceId}`;
        
        const invoiceData = {
                id: invoiceId,
                status: data.status,
                description: data.description,
                address: {
                    street: data.address.street,
                    city: data.address.city,
                    postalCode: data.address.postalCode,
                    country: data.address.country
                },
                invoiceDate: data.invoiceDate,
                paymentDue: data.paymentDue,
                paymentDueDays: data.paymentDueDays,
                dateValue: data.dateValue,
                billTo: {
                    name: data.billTo.name,
                    address: {
                        street: data.billTo.address.street,
                        city: data.billTo.address.city,
                        postalCode: data.billTo.address.postalCode,
                        country: data.billTo.address.country
                    }
                },
                items: data.items,
                sentTo: data.sentTo,
                
        }

        if (!token || !userId) {
            console.error("Authentication failed: Token or User ID missing");
            return;
        }

        const response = await fetch(`${config.databaseUrl}/invoices/${userId}.json?auth=` + token, {
            method: 'POST',
            body: JSON.stringify(invoiceData)
        })

        if(!response.ok) {
            console.log('error')
        }

        await fetch(`${config.databaseUrl}/invoices/${userId}/lastInvoiceId.json?auth=${token}`, {
            method: 'PUT',
            body: JSON.stringify(invoiceId)
        });

        context.commit('addInvoice', invoiceData);
    },
    async loadInvoices(context, _) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); 

        if (!userId || !token) {
            console.error("User not authenticated");
            return;
        }
        const response = await fetch(`${config.databaseUrl}/invoices/${userId}.json?auth=${token}`)
        const responseData = await response.json();
        if(!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch!');
            throw error;
        }
        const invoices = [];

        for (const key in responseData) {
            const invoice = responseData[key]
            if (invoice.id && invoice.description && invoice.billTo) {
                invoices.push({
                    firebaseId: key,
                    ...invoice
                });
            }
        }
        invoices.sort((a, b) => b.id - a.id); 
        context.commit('setInvoices', invoices);
        context.commit('setFetchTimestamp');
    },
    async updateInvoice(context, { firebaseId, updatedData }) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!firebaseId || !updatedData) {
            console.error("Missing data for updateInvoice");
            return;
        }

        const response = await fetch(`${config.databaseUrl}/invoices/${userId}/${firebaseId}.json?auth=${token}`, {
            method: 'PATCH', 
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            console.error("Error updating invoice");
            return;
        }

        context.commit('updateInvoice', { firebaseId, updatedData });
    },
}