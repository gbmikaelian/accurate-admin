import http from '../http'

const state = {
    histories: [],
    search: {
        fromDate: new Date(),
        toDate: new Date(),
        byClient: '',
        byPaid: ''
    },
    loaders: {
        all: false
    }
}

const actions = {
    async getAll ({ state, commit, dispatch }) {
        try {
            commit('LOADING', 'all')
            let response = await http.get('api/admin/histories')
            commit('SET', { key: 'histories', value: response.data.histories })
            commit('LOADED', 'all')
        } catch (e) {
            commit('LOADED', 'all')
            dispatch('handleErrors', e, { root: true })
        }
    },
    async search ({ state, commit, dispatch }, data) {
        try {
            commit('LOADING', 'all')
            let response = await http.get(`api/admin/histories?search=${JSON.stringify(data)}`)
            commit('SET', { key: 'histories', value: response.data.histories })
            commit('LOADED', 'all')
            console.log(response.data)
        } catch (e) {
            commit('LOADED', 'all')
            dispatch('handleErrors', e, { root: true })
        }
    }
}

const mutations = {
    SET: (state, { key, value }) => { state[key] = value },
    LOADING: (state, key) => { state.loaders[key] = true },
    LOADED: (state, key) => { state.loaders[key] = false }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
