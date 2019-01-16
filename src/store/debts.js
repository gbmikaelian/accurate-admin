import http from '../http'
import { Message } from 'element-ui'
import Debt from '../types/Debt'
import moment from 'moment'
const state = {
    totalDebt: 0,
    debt: new Debt(),
    debts: [],
    orders: [],
    clientId: '',
    dialogs: {
        debt: false,
        orders: false
    }
}

const actions = {
    async submit ({ state, commit, dispatch, rootState }) {
        try {
            rootState.buttonLoading = true

            if (parseInt(state.debt.paid) > state.totalDebt || (!parseInt(state.debt.paid)) || (!state.debt.paid)) {
                Message.error({ message: 'Սխալ արժե՛ք:' })
                rootState.buttonLoading = false
                return false
            }
            let response = await http.put(`/api/admin/debt/${state.debt.client}`, state.debt)
            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            rootState.buttonLoading = false

            commit('HIDE_DEBT_DIALOG', response.data.errors)
            dispatch('getAll', { name: '' })

            if (response.data.success) {
                Message.success({message: 'Տվյալները հաջողությամբ թարմացվել են'})
            } else {
                Message.error({message: response.data.message})
            }
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getAll ({ state, commit, dispatch }, { name }) {
        try {
            let response = await http.get(`/api/admin/debts?client_name=${name}`)
            commit('SET_ALL', response.data.clients)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getOrdersByClient ({state, commit, dispatch}, { fromDate, toDate }) {
        try {
            if (fromDate !== '') {
                fromDate = moment(fromDate).format('YYYY-MM-DD')
            } else {
                fromDate = '2018-01-01'
            }
            console.log(fromDate)
            toDate = moment(toDate).add(1, 'days').format('YYYY-MM-DD')

            let response = await http.get(`/api/admin/ordersbyclient/${state.clientId}/?from_date=${fromDate}&to_date=${toDate}`)
            commit('SET_ORDERS_BY_CLIENT', response.data.ordersByClient)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    }
}

const mutations = {
    SET_ALL: (state, debts) => {
        state.debts = debts
    },
    SET_ORDERS_BY_CLIENT: (state, orders) => {
        state.dialogs.orders = true
        state.orders = orders
    },
    REPAYMENT: (state, row) => {
        state.dialogs.debt = true
        state.debt = new Debt()
        state.debt.client = row._id
        state.totalDebt = row.total.totalPrice
    },
    REPAYMENT_HOME: (state, { clientId, clientDebt }) => {
        state.dialogs.debt = true
        state.debt = new Debt()
        state.debt.client = clientId
        state.totalDebt = clientDebt
    },
    HIDE_DEBT_DIALOG: (state, error) => {
        if (!error) {
            state.dialogs.debt = false
            state.debt = new Debt()
        }
    }
}

export default {
    namespaced: true,
    actions,
    mutations,
    state
}
