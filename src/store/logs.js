import http from '../http'

const state = {
    logs: [],
    categoryLang: {
        product: 'Գույք',
        debt: 'Պարտք',
        order: 'Պատվեր',
        client: 'Վարձակալ',
        accept: 'Ընդունում',
        contract: 'Պայմանագիր',
        user: 'Օգտատեր'
    },
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
            let response = await http.get('api/admin/logs')
            commit('SET', { key: 'logs', value: response.data.logs })
            commit('LOADED', 'all')
        } catch (e) {
            commit('LOADED', 'all')
            dispatch('handleErrors', e, { root: true })
        }
    },
    async search ({ state, commit, dispatch }, data) {
        try {
            commit('LOADING', 'all')
            let response = await http.get(`api/admin/logs?search=${JSON.stringify(data)}`)
            commit('SET', { key: 'logs', value: response.data.logs })
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
