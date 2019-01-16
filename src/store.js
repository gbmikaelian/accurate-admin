import Vue from 'vue'
import Vuex from 'vuex'
import http from './http'
import { Message } from 'element-ui'
import moment from 'moment'
import products from './store/products'
import clients from './store/clients'
import orders from './store/orders'
import home from './store/home'
import transactions from './store/transactions'
import debts from './store/debts'
import contracts from './store/contracts'
import users from './store/users'
import histories from './store/histories'
import logs from './store/logs'

Vue.use(Vuex)

const state = {
    validateNumberInput (inputs) {
        let validate = true
        inputs.forEach(element => {
            if (!(/^[0-9]*$/gm.test(element))) {
                validate = false
                return validate
            }
        })
        return validate
    },
    reformatDate (date) {
        return moment.utc(date).format('DD/MM/YYYY')
    },
    replacedPrice (price) {
        return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} &#1423;`
    },
    errorMessage: '',
    login: {
        username: '',
        password: ''
    },
    baseURL: `${window.location.protocol}//${window.location.hostname}:4008`,
    buttonLoading: false,
    admin: {}
}

const actions = {
    handleErrors ({ state, commit }, error) {
        // console.log(error)
        // console.log(error.response)

        if (error.message) {
            Message.error({ message: error.message })
        }

        if (error.response) {
            if (error.response.data && error.response.data.message) {
                Message.error({ message: error.response.data.message })
            }
        }
        if (error.response && error.response.status === 401) {
            commit('LOGOUT')
        }
    },
    async login ({ state, commit, dispatch }) {
        try {
            let response = await http.post('/auth/login', state.login)
            commit('LOGIN', response.data.token)
        } catch (e) {
            dispatch('handleErrors', e)
        }
    }
    // async createUser ({state, commit, dispatch}, {type, typeId, name}) {
    //   try {
    //     let data = new FormData()
    //     Object.entries(state.single[type]).forEach(([key, value]) => {
    //       data.append(key, value)
    //     })
    //
    //     let response = await http.post(`/oauth/register`, data)
    //
    //     if (response.data.errors) { // mongoose errors
    //       dispatch('handleErrors', response.data, { root: true })
    //     }
    //     dispatch('getAll', {type: name})
    //     commit('HIDE_DIALOG', {type: type})
    //   } catch (e) {
    //     dispatch('handleErrors', e)
    //   }
    // },
}

const mutations = {
    LOGIN: (state, token) => {
        localStorage.setItem('token', token)
        window.location = '/'
    },
    LOGOUT: (state, token) => {
        localStorage.removeItem('token')
        window.location = '/#/login'
    },
    SET_USER: (state, user) => {
        state.admin = user
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
        products,
        clients,
        orders,
        home,
        transactions,
        debts,
        contracts,
        users,
        histories,
        logs
    }
})
