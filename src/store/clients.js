import http from '../http'
import Client from '../types/Client'
import { MessageBox } from 'element-ui'

const state = {
    clientType: {
        llc: 'ՍՊԸ',
        sole: 'Սովորական',
        owned: 'Մեր'
    },
    clients: [],
    rentedProducts: [],
    tags: {
        phoneNumber: '',
        phoneNumberVisible: false
    },
    client: new Client(),
    dialogs: {
        client: false
    }
}

const getters = {
    getTotalPrice (state) {
        let totalPrice = 0
        state.clients.map(client => { totalPrice += client.price.dayPrice })
        return totalPrice
    }
}

const actions = {
    async submit ({ state, commit, dispatch, rootState }, page = '?all=1') {
        try {
            rootState.buttonLoading = true
            let response
            if (state.client._id) {
                response = await http.put(`/api/admin/client/${state.client._id}`, state.client)
            } else {
                response = await http.post(`/api/admin/client`, state.client)
            }
            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            dispatch('getAll', page)

            rootState.buttonLoading = false

            commit('HIDE_CLIENT_DIALOG', response.data.errors)
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getAll ({ state, commit, dispatch }) {
        try {
            let response = await http.get(`/api/admin/clients?with_price=true`)
            commit('SET_ALL', response.data.clients.data)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async search ({ state, commit, dispatch }, data) {
        try {
            let response = await http.get(`/api/admin/clients?search=${JSON.stringify(data)}&with_price=true`)
            commit('SET_ALL', response.data.clients.data)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getRentedProducts ({ state, commit, dispatch }, clientId) {
        try {
            let response = await http.get(`/api/admin/prodsbyClient/${clientId}/current?product_name=`)
            commit('SET_RENTED_PRODUCTS', response.data.products)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async remove ({ state, commit, dispatch }, { id }) {
        try {
            await MessageBox.confirm('Դուք իսկապե՞ս ցանկանում եք ջնջել', 'Զգուշացում', {
                confirmButtonText: 'Այո',
                cancelButtonText: 'Չեղարկել',
                type: 'warning'
            })
            await http.delete(`/api/admin/client/${id}`)
            dispatch('getAll')
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    edit ({state, dispatch}, { data }) {
        state.dialogs.client = true
        state.client = {...data, stopProducts: []}
        dispatch('getRentedProducts', data._id)
    }
}

const mutations = {
    SET_ALL: (state, clients) => {
        state.clients = clients
    },
    SET_RENTED_PRODUCTS: (state, rentedProducts) => {
        state.rentedProducts = rentedProducts
    },
    SHOW_CLIENT_DIALOG: (state) => {
        state.dialogs.client = true
        state.client = new Client()
    },
    HIDE_CLIENT_DIALOG: (state, error) => {
        if (!error) {
            state.dialogs.client = false
            state.client = new Client()
        }
    },
    SET_TAGS: (state, { column }) => {
        if (state.tags[column]) {
            state.client[`${column}s`].push(state.tags[column])
        }
        state.tags[`${column}Visible`] = false
        state.tags[column] = ''
    },
    HANDLE_CLOSE (state, { tag, column }) {
        state.client[column].splice(state.client[column].indexOf(tag), 1)
    }
}

export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}
