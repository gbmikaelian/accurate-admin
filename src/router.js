import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'

import Products from '@/components/product/Products'
import Damageds from '@/components/product/Damageds'
import Clients from '@/components/client/Clients'
import Orders from '@/components/order/Orders'
import Home from '@/components/home/Home'
import Transaction from '@/components/transaction/Transactions'
import Debt from '@/components/debt/Debts'
import User from '@/components/user/Users'
import Contracts from '@/components/contracts/Contracts'
import Histories from '@/components/histories/Histories'
import Logs from '@/components/logs/Logs'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'dashboard',
            meta: { protected: true },
            component: Dashboard,
            children: [
                { path: '/contracts', name: 'contracts', component: Contracts },
                { path: '/histories', name: 'history', component: Histories },
                { path: '/logs', name: 'logs', component: Logs },
                { path: '/products', name: 'products', component: Products },
                { path: '/damageds', name: 'damageds', component: Damageds },
                { path: '/clients', name: 'clients', component: Clients },
                { path: '/orders', name: 'orders', component: Orders },
                { path: '/transactions', name: 'transactions', component: Transaction },
                { path: '/debts', name: 'debts', component: Debt },
                { path: '/users', name: 'users', component: User },
                { path: '/', name: 'home', component: Home }
            ]
        },
        { path: '/login', name: 'login', component: Login }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.protected)) {
        if (!localStorage.getItem('token')) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
