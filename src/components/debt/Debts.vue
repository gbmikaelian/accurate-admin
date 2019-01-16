<template>
    <div v-if="this.$store.state.admin.type === 'superadmin' || this.$store.state.admin.type === 'director'">
        <el-card>
            <div slot="header">
                <el-row
                    type="flex"
                    justify="space-between"
                    align="middle">
                    <h4>
                        Պարտքեր
                    </h4>
                </el-row>
            </div>

            <p>
                <span>Փնտրել</span>
            </p>
            <el-input
                v-model="clientName"
                style="width:250px;margin-bottom:20px"
                placeholder="Անուն">
            </el-input>

            <el-table
                :data="debts"
                stripe
                border
                style="width: 100%"
                class="header-background">
                    <el-table-column
                        label="Վարձակալ"
                        prop="fullName">
                    </el-table-column>

                    <el-table-column
                        label="Ընդհանուր պարտք"
                        prop="total.totalPrice">
                        <template slot-scope="scope">
                            <a href="#" @click.prevent="getOrders(scope.row._id)">
                                <span v-html="$store.state.replacedPrice(scope.row.total.totalPrice)"></span>
                            </a>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="Ապրանքների գին"
                        prop="total.costPrice">
                        <template slot-scope="scope">
                            <span v-html="$store.state.replacedPrice(scope.row.total.costPrice)"></span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        v-if="this.$store.state.admin.type === 'superadmin'"
                        label="Վճար"
                        width="120">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="$store.commit('debts/REPAYMENT', scope.row)">
                                        Վճար
                                </el-button>
                            </template>
                    </el-table-column>

            </el-table>
        </el-card>
        <debt/>
        <orders/>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Debt from './Debt'
import Orders from './Orders'
export default {
    data () {
        return {
            clientName: ''
        }
    },
    components: {
        Debt,
        Orders
    },
    computed: {
        ...mapState('debts', ['debts', 'debt'])
    },
    methods: {
        getOrders: function (id) {
            this.$store.state.debts.clientId = id
            this.$store.dispatch('debts/getOrdersByClient', { fromDate: '', toDate: new Date() })
        },
        onClientNameChange: function () {
            setTimeout(() => {
                this.$store.dispatch('debts/getAll', { name: this.clientName })
            }, 300)
        }
    },
    watch: {
        'clientName': 'onClientNameChange'
    },
    mounted () {
        this.$store.dispatch('debts/getAll', { name: '' })
    }
}
</script>
