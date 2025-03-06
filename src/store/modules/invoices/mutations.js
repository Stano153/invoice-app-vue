export default {
    addInvoice(state, payload) {
        state.invoices.unshift(payload);
    },
    setInvoices(state, payload) {
        state.invoices = payload;
    },
    setFetchTimestamp(state) {
        state.lastFetch = new Date().getTime();
    },
    updateInvoice(state, { firebaseId, updatedData }) {
        const index = state.invoices.findIndex(inv => inv.firebaseId === firebaseId);
        if (index !== -1) {
            state.invoices[index] = { ...state.invoices[index], ...updatedData };
        }
    }
}