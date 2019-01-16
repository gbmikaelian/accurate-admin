import http from '../http'
import User from '../types/User'
import { MessageBox } from 'element-ui'

const state = {
    userTypes: {
        storehouse: 'Պահեստապետ',
        director: 'Տնօրեն',
        secretary: 'Քարտուղար',
        superadmin: 'Գլխավոր Ադմին',
        accountant: 'Հաշվապահ'
    },
    all: [],
    one: {},
    admin: {},
    user: new User(),
    dialogs: {
        user: false
    }
}
const actions = {
    async getAll ({ store, commit, dispatch }) {
        try {
            let response = await http.get(`/api/admin/users`)
            commit('SET_ALL', response.data.users)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async me ({ store, commit, dispatch, rootState }) {
        try {
            var response = await http.get(`/api/admin/me`)
            rootState.admin = response.data.user
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getOne ({ store, commit, dispatch }, id) {
        try {
            let response = await http.get(`/api/admin/user/${id}`)
            commit('SET_ONE', response.data.user)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async submit ({ state, commit, dispatch, rootState }, update) {
        try {
            rootState.buttonLoading = true

            let data = state.user
            let response
            if (update) {
                response = await http.put(`/api/admin/user/${state.user._id}`, data)
                console.log(`/api/admin/user/${state.user._id}`)
            } else {
                response = await http.post('/api/admin/register', data)
            }
            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            dispatch('getAll')

            rootState.buttonLoading = false

            commit('HIDE_USER_DIALOG')
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }
    },
    async remove ({ state, commit, dispatch }, id) {
        try {
            await MessageBox.confirm('Դուք իսկապե՞ս ցանկանում եք ջնջել', 'Զգուշացում', {
                confirmButtonText: 'Այո',
                cancelButtonText: 'Չեղարկել',
                type: 'warning'
            })
            await http.delete(`/api/admin/user/${id}`)
            dispatch('getAll')
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    }
}

const mutations = {
    SET_ALL: (state, users) => {
        state.all = users
    },
    SET_ONE: (state, user) => {
        state.one = user
    },
    SET_USER: (state, user) => {
        state.admin = user
    },
    EDIT: (state, data) => {
        state.dialogs.user = true
        state.user = data
    },
    ADD: (state) => {
        state.dialogs.user = true
        state.user = new User()
    },
    SHOW_USER_DIALOG: (state) => {
        state.dialogs.user = true
        state.user = new User()
    },
    HIDE_USER_DIALOG: (state, error) => {
        if (!error) {
            state.dialogs.user = false
            state.user = new User()
        }
    }
}
export default {
    namespaced: true,
    state,
    actions,
    mutations
}
