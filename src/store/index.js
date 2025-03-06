import { createStore } from "vuex";

import invoicesModule from './modules/invoices/index.js'
import authModule from './modules/auth/index.js'

const store = createStore({
    modules: {
        invoices: invoicesModule,
        auth: authModule
    }

});

export default store;