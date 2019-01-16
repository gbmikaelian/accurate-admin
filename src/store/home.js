import http from '../http'
import Accept from '../types/Accept'

const state = {
    products: [],
    productsByClient: [],
    orders: [],
    accepts: [],
    clientsByprod: [],
    clients: [],
    clientInfo: {},
    accept: new Accept(),
    productId: '',
    clientId: '',
    itemId: '',
    orderId: '',
    orderType: 'current',
    orderDialog: false,
    currentPage: 1,
    dialogs: {
        orders: false,
        accepts: false,
        accept: false,
        clients: false,
        products: false,
        paymentHistories: false
    }
}

const actions = {
    async getAllRentedProducts ({ state, commit, dispatch }, { toDate }) {
        try {
            let response = await http.get(`/api/admin/home?to_date=${toDate}`)
            commit('SET_ALL_PRODUCTS', response.data.products)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getAllClient ({ store, commit, dispatch }, { fromDate, toDate, page }) {
        try {
            let response = await http.get(`/api/admin/clients?products=true&page=${page}&from_date=${fromDate}&to_date=${toDate}`)

            commit('SET_ALL_CLIENT', response.data.clients)
            // commit('SHOW_ORDERS_DIALOG', response.data.clients.find(client => client._id === clientId).orders)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getOrdersByClientAndproduct ({state, commit, dispatch}, { type, fromDate, toDate }) {
        try {
            let response = await http.get(`/api/admin/ordersbyclientproduct/${state.clientId}/${state.productId}/${type}?from_date=${fromDate}&to_date=${toDate}`)

            commit('SET_ORDERS_BY_CLIENT_AND_PRODUCT', response.data.clientOrders)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getAllClientsByProd ({ state, commit, dispatch }, { type, clientName }) {
        try {
            let response = await http.get(`/api/admin/clientsbyprod/${state.productId}/${type}?client_name=${clientName}`)
            commit('SET_CLIENTS_BY_PROD', response.data.clients)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getAllProductsByClient ({ state, commit, dispatch }, { type, productName }) {
        try {
            let response = await http.get(`/api/admin/prodsbyClient/${state.clientId}/${type}?product_name=${productName}`)

            commit('SET_PRODUCTS_BY_CLIENT', response.data.products)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async getAllHistoriesByClient ({ state, commit, dispatch }, { type, fromDate, toDate }) {
        try {
            let response = await http.get(`/api/admin/historiesbyclient/${state.clientId}?type=${type}&from_date=${fromDate}&to_date=${toDate}`)
            commit('SET_CLIENT_INFO', response.data.clientInfo)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async getAllAceptsByItem ({ state, commit, dispatch }) {
        try {
            let response = await http.get(`/api/admin/acceptsbyitem/${state.itemId}`)
            commit('SET_ACCEPTS', response.data.accepts)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async getAllAceptsByOrder ({ state, commit, dispatch }) {
        try {
            let response = await http.get(`/api/admin/acceptsbyorder/${state.orderId}`)
            commit('SET_ACCEPTS', response.data.accepts)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async accept ({ state, commit, dispatch, rootState }) {
        try {
            rootState.buttonLoading = true
            let data = state.accept
            let response

            response = await http.post(`/api/admin/accept/`, data)

            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            rootState.buttonLoading = false

            commit('HIDE_ACCEPT_DIALOG')

            if (state.orderDialog) {
                await Promise.all([
                    dispatch('getOrdersByClientAndproduct', { type: 'current', fromDate: '', toDate: '' }),
                    dispatch('getAllClient', { fromDate: '', toDate: '', page: state.currentPage })
                ])
            } else {
                await Promise.all([
                    dispatch('getAllHistoriesByClient', { type: 'current', fromDate: '', toDate: '' }),
                    dispatch('getAllClient', { fromDate: '', toDate: '', page: state.currentPage })
                    // dispatch('getAllAceptsByItem')
                ])
            }
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }

        await dispatch('getAllRentedProducts', { toDate: '' })
    }
}

const mutations = {
    SET_ALL_PRODUCTS: (state, products) => {
        state.products = products
    },
    SET_ALL_CLIENT: (state, clients) => {
        state.clients = clients
    },
    SET_ORDERS_BY_CLIENT_AND_PRODUCT: (state, orders) => {
        state.orders = orders
        state.dialogs.orders = true
    },
    SHOW_ACCEPTS_DIALOG: (state, accepts) => {
        state.dialogs.orders = false
        state.dialogs.accepts = true
        state.accepts = {...accepts}
    },
    SET_CLIENTS_BY_PROD: (state, clients) => {
        state.dialogs.orders = false
        state.dialogs.clients = true
        state.clientsByprod = clients
    },
    SET_ACCEPTS: (state, accepts) => {
        state.dialogs.accepts = true
        state.accepts = accepts
    },
    SET_PRODUCTS_BY_CLIENT: (state, products) => {
        state.dialogs.orders = false
        state.dialogs.products = true
        state.productsByClient = products
    },
    SET_CLIENT_INFO: (state, clientInfo) => {
        state.dialogs.paymentHistories = true
        state.clientInfo = clientInfo
    },
    SET_PRODUCT_ID: (state, id) => {
        state.productId = id
    },
    SET_CLIENT_ID: (state, id) => {
        state.clientId = id
    },
    ACCEPT_PRODUCT: (state, accept) => {
        state.accept = new Accept()
        state.orderDialog = true
        state.dialogs.accept = true
        state.itemId = accept.item
        state.accept = {
            orderId: accept.info._id,
            productId: accept.product._id,
            acceptAt: new Date(),
            normal: state.accept.normal,
            damaged: state.accept.damaged,
            lost: state.accept.lost
        }
    },
    ACCEPT_PRODUCT_BY_CLIENT: (state, {accept, orderId, clientId}) => {
        state.accept = new Accept()
        state.dialogs.accept = true
        state.clientId = clientId
        state.productId = accept.product._id
        state.itemId = accept.item._id
        state.accept = {
            orderId: orderId,
            productId: accept.product._id,
            acceptAt: new Date(),
            normal: state.accept.normal,
            damaged: state.accept.damaged,
            lost: state.accept.lost
        }
    },
    HIDE_ACCEPT_DIALOG: (state) => {
        state.dialogs.accept = false
    }
}

export default {
    namespaced: true,
    actions,
    mutations,
    state
}
