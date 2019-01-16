import http from '../http'
import Order from '../types/Order'
import Accept from '../types/Accept'
import { MessageBox, Message } from 'element-ui'

const state = {
    confirmed: true,
    confirmedOrder: 'Նախնական',
    orders: [],
    accept: new Accept(),
    productPrices: {},
    productOption: '',
    availableAmount: 0,
    order: new Order(),
    dialogs: {
        order: false,
        accept: false
    },
    confirmOrderButton: false
}

const actions = {
    async submit ({ state, commit, dispatch, rootState }, page = '?all=1') {
        try {
            rootState.buttonLoading = true
            let validNumber = true
            let inputs = [
                state.order.deposit,
                state.order.totalSale
            ]
            if (!rootState.validateNumberInput(inputs)) {
                Message.error({ message: 'Դուք պետք է մուտքագրեք թիվ !' })
                rootState.buttonLoading = false
                return false
            }

            state.order.products.map(product => {
                if (!(/^[0-9]*$/gm.test(product.amount))) {
                    validNumber = false
                } else if (!(/^[0-9]*$/gm.test(product.sale))) {
                    validNumber = false
                } else if (!(/^[0-9]*$/gm.test(product.cost))) {
                    validNumber = false
                }
                if (!validNumber) { return false }
            })
            if (!validNumber) {
                Message.error({ message: 'Դուք պետք է մուտքագրեք թիվ !' })
                rootState.buttonLoading = false
                return false
            }
            let response
            let confirm = state.confirmed
            if (state.order._id) {
                response = await http.put(`/api/admin/order/${state.order._id}`, state.order)
            } else {
                confirm = ''
                response = await http.post(`/api/admin/order`, state.order)
            }
            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            dispatch('getAll', {
                fromDate: '',
                toDate: '',
                orderNumber: '',
                clientName: '',
                productName: '',
                confirmedOrder: confirm
            })

            rootState.buttonLoading = false

            commit('HIDE_ORDER_DIALOG', response.data.errors)
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getAll ({ state, commit, dispatch }, {fromDate, toDate, orderNumber, clientName, productName, confirmedOrder}) {
        try {
            let query = `/api/admin/orders?from_date=${fromDate}&to_date=${toDate}&order_number=${orderNumber}&product_name=${productName}&client_name=${clientName}&confirmed=${confirmedOrder}`
            let response = await http.get(query)

            commit('SET_ALL', response.data.ordersByClient)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getOne ({ state, commit, dispatch }, id) {
        try {
            let response =
                 await http.get(`/api/admin/products/${id}`)
            commit('ADD_PRODUCT', response.data)
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getOrder ({ store, commit, dispatch }, {data}) {
        try {
            let response = await http.get(`/api/admin/products/${data.info._id}?products=true`)
            commit('EDIT', {data, response: response.data})
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async getProduct ({ store, commit, dispatch }, {id, type, sold, index}) {
        try {
            let response = await http.get(`/api/admin/products/${id}`)

            let product = state.order.products[index]
            if (product.sold && !type) {
                product.availableAmount = response.data.availableAmountNew
                product.cost = response.data.newSoldPrice
            } else if (product.sold && type) {
                product.availableAmount = response.data.availableAmountUsed
                product.cost = response.data.oldSoldPrice
            } else if (!product.sold && !type) {
                product.availableAmount = response.data.availableAmountNew
                product.cost = response.data.newRentedPrice
            } else if (!product.sold && type) {
                product.availableAmount = response.data.availableAmountUsed
                product.cost = response.data.oldRentedPrice
            }
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    async remove ({ state, commit, dispatch }, {id}) {
        try {
            await MessageBox.confirm('Դուք իսկապե՞ս ցանկանում եք ջնջել', 'Զգուշացում', {
                confirmButtonText: 'Այո',
                cancelButtonText: 'Չեղարկել',
                type: 'warning'
            })
            await http.delete(`/api/admin/order/${id}`)
            dispatch('getAll', {
                fromDate: '',
                toDate: '',
                orderNumber: '',
                clientName: '',
                productName: '',
                confirmedOrder: state.confirmed
            })
        } catch (e) {
            dispatch('handleErrors', e, { root: true })
        }
    },
    addMore ({state, dispatch}) {
        let products = state.order.products.filter(el => {
            return el.product === state.order.product.product
        })
        if (!products.length) {
            state.order.products.push({...new Order().product})
        }
    },

    async accept ({ state, commit, dispatch, rootState }) {
        try {
            let data = state.accept
            let response

            rootState.buttonLoading = true
            response = await http.post(`/api/admin/accept/`, data)

            if (response.data.errors) { // mongoose errors
                dispatch('handleErrors', response.data, { root: true })
            }
            rootState.buttonLoading = false

            commit('HIDE_ACCEPT_DIALOG')

            dispatch('getAll', {fromDate: '', toDate: '', orderNumber: '', clientName: '', productName: '', confirmedOrder: state.confirmed})
        } catch (e) {
            rootState.buttonLoading = false
            dispatch('handleErrors', e, { root: true })
        }
    }
}
const mutations = {
    SET_ALL: (state, orders) => {
        state.orders = orders
    },
    EDIT: (state, { data, response }) => {
        let products = []
        let cost
        for (let availableProduct of response.products) {
            if (!availableProduct.item.used) {
                if (availableProduct.item.sold) {
                    cost = availableProduct.transaction.info.newSoldPrice
                } else {
                    cost = availableProduct.transaction.info.newSoldPrice
                }

                products.push({...availableProduct.item, availableAmount: availableProduct.transaction.availableAmountNew, cost: cost})
            } else if (availableProduct.item.used) {
                if (availableProduct.item.sold) {
                    cost = availableProduct.transaction.info.oldSoldPrice
                } else {
                    cost = availableProduct.transaction.info.oldRentedPrice
                }

                products.push({
                    ...availableProduct.item,
                    availableAmount: availableProduct.transaction.availableAmountUsed,
                    cost: cost
                })
            }
        }

        let client

        if (data.info.client) {
            client = data.info.client
        } else {
            client = data.client
        }
        if (!state.confirmOrderButton) {
            state.dialogs.order = true
        }
        state.order = {
            ...data.info,
            client: client,
            products: products,
            totalSale: 0
        }
    },
    EDIT_HOME_ORDER: (state, { data }) => {
        let products = []
        for (let product of data.row.products) {
            products.push(product.item)
        }
        state.dialogs.order = true
        state.order = {...data.row.info, products: products, client: data.clientInfo}
        // let response = await http.get(`/api/admin/order/${data.row.info._id}?order=true`)
    },
    SHOW_ORDER_DIALOG: (state) => {
        state.dialogs.order = true
        state.includeProducts = []
        state.order = new Order()
    },
    HIDE_ORDER_DIALOG: (state, error) => {
        if (!error) {
            state.dialogs.order = false
            state.includeProducts = []
            state.order = new Order()
        }
    },
    ADD_PRODUCT: (state, product) => {
        state.order.products.push({
            name: product.name,
            product: product._id,
            sale: 0,
            amount: 0,
            used: false,
            sold: false,
            cost: product.newRentedPrice,
            availableAmount: product.availableAmountNew
        })
        state.order.productOption = ''
    },
    ACCEPT_PRODUCT: (state, {accept, orderId}) => {
        state.dialogs.accept = true
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
    },
    REMOVE_PRODUCT: (state, key) => {
        state.order.products.splice(key, 1)
    },
    SET_TAGS: (state, { column }) => {
        if (state.tags[column]) {
            state.order[`${column}s`].push(state.tags[column])
        }
        state.tags[`${column}Visible`] = false
        state.tags[column] = ''
    },
    HANDLE_CLOSE (state, { tag, column }) {
        state.order[column].splice(state.order[column].indexOf(tag), 1)
    }
}

export default {
    namespaced: true,
    actions,
    mutations,
    state
}
