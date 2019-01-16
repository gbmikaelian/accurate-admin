import http from '../http'
import Product from '../types/Product'
import { MessageBox, Message } from 'element-ui'

const state = {
    all: [],
    translateType: '',
    damageds: [],
    productAmount: {},
    one: {},
    product: new Product(),
    dialogs: {
        product: false,
        addAmount: false
    }
}

const actions = {
    async getAll ({ state, commit, dispatch }, {all, toDate, productName}) {
        try {
            toDate = toDate || new Date()
            let response = await http.get(`/api/admin/products/?all=${all}&to_date=${toDate}&product_name=${productName}`)
            commit('SET_ALL', response.data.products)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async getOne ({ state, commit, dispatch }, id) {
        try {
            let response = await http.get(`/api/admin/products/${id}`)
            commit('SET_ONE', response.data.product)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async getAllDamaged ({state, commit, dispatch}) {
        try {
            let response = await http.get(`/api/admin/damgedproducts/`)

            let damageds = []

            for (let damaged of response.data.products) {
                if (damaged.totalDamaged > 0) {
                    damageds.push(damaged)
                }
            }

            // console.log(damageds)
            commit('SET_ALL_DAMAGED', damageds)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },

    async submit ({state, commit, dispatch, rootState}, update) {
        try {
            rootState.buttonLoading = true

            let data = state.product
            let response
            if (update) {
                response = await http.put(`/api/admin/products/${state.product._id}`, data)
            } else {
                response = await http.post('/api/admin/products', data)
            }
            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            dispatch('getAll', { all: '', toDate: '', productName: '' })

            rootState.buttonLoading = false

            commit('HIDE_PRODUCT_DIALOG')
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }
    },

    async changeAmount ({state, commit, dispatch, rootState}) {
        try {
            rootState.buttonLoading = true

            let data = state.product
            if (!data.addedAmount) {
                Message.error({message: 'Դատարկ արժե՛ք։'})
                rootState.buttonLoading = false
                return false
            }

            if (!data.add) {
                if (!data.addedAmount) {
                    Message.error({message: 'Դատարկ արժե՛ք։'})
                    rootState.buttonLoading = false
                    return false
                }
                if (data.used) {
                    if (data.addedAmount > state.productAmount.availableAmountUsed) {
                        Message.error({message: 'Քանակը սխա՛լ է։'})
                        rootState.buttonLoading = false
                        return false
                    }
                } else {
                    if (data.addedAmount > state.productAmount.availableAmountNew) {
                        Message.error({message: 'Քանակը սխալ է'})
                        rootState.buttonLoading = false
                        return false
                    }
                }
                data.addedAmount = -data.addedAmount
            }
            let response
            response = await http.put(`/api/admin/products/${state.product._id}`, data)

            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            dispatch('getAll', { all: '', toDate: '', productName: '' })

            rootState.buttonLoading = false
            commit('HIDE_PRODUCT_DIALOG')
            state.dialogs.addAmount = false
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }
    },

    async remove ({state, commit, dispatch}, id) {
        try {
            await MessageBox.confirm('Դուք իսկապե՞ս ցանկանում եք ջնջել', 'Զգուշացում', {
                confirmButtonText: 'Այո',
                cancelButtonText: 'Չեղարկել',
                type: 'warning'
            })
            await http.delete(`/api/admin/products/${id}`)
            dispatch('getAll', { all: '', toDate: '', productName: '' })
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    }
}

const mutations = {
    SET_ALL: (state, products) => {
        state.all = products
    },
    SET_ALL_DAMAGED: (state, damageds) => {
        state.damageds = damageds
    },
    SET_ONE: (state, product) => {
        state.one = product
    },
    EDIT: (state, product) => {
        state.dialogs.product = true
        state.product = {...product.info, used: false}
    },
    ADD_AMOUNT: (state, {product, add}) => {
        state.translateType = add ? 'Ավելացնել քանակ' : 'Նվազեցնել քանակ'
        state.productAmount = product
        state.dialogs.addAmount = true
        let availableAmount
        if (state.product.used) {
            availableAmount = state.productAmount.availableAmountUsed
        } else {
            availableAmount = state.productAmount.availableAmountNew
        }
        state.product = {
            ...product.info,
            add: add,
            used: state.product.used,
            availableAmount: availableAmount
        }
    },
    SHOW_PRODUCT_DIALOG: (state) => {
        state.dialogs.product = true
        state.product = new Product()
    },
    HIDE_PRODUCT_DIALOG: (state) => {
        // state.product = new Product()
        state.dialogs.product = false
        state.dialogs.addAmount = false
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
