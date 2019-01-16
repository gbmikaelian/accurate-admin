import http from '../http'
import Transaction from '../types/Transaction'

const state = {
    transactions: [],
    single: new Transaction(),
    dialogs: {
        transaction: false
    }
}

const actions = {
    async getAll ({ state, commit, dispatch }, page = '') {
        try {
            let response = await http.get(`/api/admin/transactions${page}`)
            commit('SET_ALL', response.data.transactions)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async remont ({ state, commit, dispatch, rootState }) {
        try {
            let data = state.single
            let response
            if (data.totalDamaged >= data.remontedAmount && data.remontedAmount > 0) {
                response = await http.post('/api/admin/remontproduct', data)
            } else {
                rootState.buttonLoading = false
                dispatch('handleErrors', {message: `Սխալ քանակ: Հասանելի քանակ ${data.totalDamaged} հատ`}, { root: true })

                return false
            }

            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            // dispatch('getAll')

            rootState.buttonLoading = false

            state.dialogs.transaction = false
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }
    }
}
const mutations = {
    SET_ALL: (state, transactions) => {
        state.transactions = transactions
    },
    remont: (state, transaction) => {
        state.dialogs.transaction = true
        console.log(transaction)
        state.single = new Transaction()
        state.single.product = transaction.info._id
        state.single.totalDamaged = transaction.totalDamaged
    }
}

export default {
    namespaced: true,
    actions,
    mutations,
    state
}
