import http from '../http'
import Contract from '../types/Contract'
import { Message, MessageBox } from 'element-ui'

const state = {
    contracts: [],
    contract: {},
    loaders: {
        all: false,
        submit: false,
        print: false
    },
    dialogs: {
        contract: false,
        viewContract: false
    }
}

const actions = {
    async getAll ({ state, commit, dispatch }) {
        try {
            commit('LOADING', 'all')
            let response = await http.get('api/admin/contracts')
            commit('SET', { key: 'contracts', value: response.data.contracts })
            commit('LOADED', 'all')
        } catch (e) {
            commit('LOADED', 'all')
            dispatch('handleErrors', e, { root: true })
        }
    },
    async submit ({ state, commit, dispatch, rootState }, options) {
        try {
            // commit('LOADING', 'submit')
            rootState.buttonLoading = true

            if (options && options.update) {
                await http.put(`api/admin/contracts/${state.contract._id}`, state.contract)
            } else {
                await http.post('api/admin/contracts', state.contract)
            }

            dispatch('getAll')

            rootState.buttonLoading = false

            commit('CLOSE_DIALOG', 'contract')
            // commit('LOADED', 'submit')

            Message.success({ message: 'Տվյալները հաջողությամբ թարմացվել են!' })
        } catch (e) {
            rootState.buttonLoading = false
            commit('LOADED', 'submit')
            dispatch('handleErrors', e, { root: true })
        }
    },
    async remove ({ state, commit, dispatch }, contractId) {
        try {
            await MessageBox.confirm('Դուք իսկապե՞ս ցանկանում եք ջնջել', 'Զգուշացում', {
                confirmButtonText: 'Այո',
                cancelButtonText: 'Չեղարկել',
                type: 'warning'
            })
            commit('LOADING', 'all')
            await http.delete(`api/admin/contracts/${contractId}`)
            dispatch('getAll')
        } catch (e) {
            commit('LOADED', 'all')
            dispatch('handleErrors', e, { root: true })
        }
    }
}

const mutations = {
    SET: (state, { key, value }) => { state[key] = value },
    LOADING: (state, key) => { state.loaders[key] = true },
    LOADED: (state, key) => { state.loaders[key] = false },
    EDIT: (state, contract) => {
        state.dialogs.contract = true
        state.contract = {...contract}
    },
    VIEW: (state, contract) => {
        state.dialogs.viewContract = true
        state.contract = { ...contract }
    },
    ADD: (state) => {
        state.dialogs.contract = true
        state.contract = new Contract()
    },
    CLOSE_DIALOG: (state, key) => { state.dialogs[key] = false }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
