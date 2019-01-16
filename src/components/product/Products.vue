<template>
    <div v-if="$store.state.admin.type !== 'secretary'">
        <el-card>
            <el-row
                type="flex"
                justify="space-between"
                align="middle">
                <h4>Գույք</h4>

                <el-button
                    v-if="$store.state.admin.type === 'superadmin' || $store.state.admin.type === 'storehouse'"
                    type="primary"
                    plain
                    @click="$store.commit('products/SHOW_PRODUCT_DIALOG')">
                    Ավելացնել
                </el-button>
            </el-row>

            <div>
                <template>
                    <div class="block" style="margin-bottom: 20px">
                        <span class="demonstration">Մինչև</span>

                        <el-date-picker
                            v-model="toDate"
                            @keyup.enter.native="search"
                            @change="search"
                            type="date"
                            placeholder="Ընտերք օրը"/>
                        <el-input
                            style="width:250px;margin-bottom:20px"
                            placeholder="Անուն"
                            v-model="productName">
                        </el-input>
                    </div>
                </template>
            </div>

            <el-table
                :data="all"
                stripe
                border
                style="width: 100%"
                class="header-background">

                <el-table-column type="expand">
                    <template slot-scope="prop">
                        <el-table :data="[prop.row]" stripe border>
                            <el-table-column
                                label="Վաճառված"
                                prop="soldAmount"/>

                            <el-table-column
                                label="Վարձակալած"
                                prop="rentedAmount"/>

                            <el-table-column
                                label="Առկա"
                                prop="availableAmount"/>

                            <el-table-column
                                label="Վաճառված Նոր"
                                prop="soldAmountNew"/>

                            <el-table-column
                                label="Վաճառված հին"
                                prop="soldAmountUsed"/>

                            <el-table-column
                                label="Նոր ընդհանուր"
                                prop="totalAmountNew"/>

                            <el-table-column
                                label="Օգտագործված ընդհանուր"
                                prop="totalAmountUsed"/>

                            <el-table-column
                                label="Ընդհանուր"
                                prop="totalAmount"/>
                            <el-table-column
                              label="Ամրագրված"
                              prop="totalReserveAmount"/>
                        </el-table>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="info.name"
                    label="Անվանում"/>

                <el-table-column
                    label="Վաճառքի գին">
                    <el-table-column
                        label="Նոր">
                        <template slot-scope="scope">
                            <span v-if="scope.row.info" v-html="$store.state.replacedPrice(scope.row.info.newSoldPrice)"></span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="info.oldSoldPrice"
                        label="Հին">
                        <template slot-scope="scope">
                            <span v-if="scope.row.info" v-html="$store.state.replacedPrice(scope.row.info.oldSoldPrice)"></span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column
                    label="Վարձույթի գին">

                    <el-table-column
                        prop="info.newRentedPrice"
                        label="Նոր">
                      <template slot-scope="scope">
                          <span v-if="scope.row.info" v-html="$store.state.replacedPrice(scope.row.info.newRentedPrice)"></span>
                      </template>
                    </el-table-column>

                    <el-table-column
                        prop="info.oldRentedPrice"
                        label="Հին">
                        <template slot-scope="scope">
                            <span v-if="scope.row.info" v-html="$store.state.replacedPrice(scope.row.info.oldRentedPrice)"></span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column
                    label="Գործողություններ" width="300px"
                    v-if="$store.state.admin.type === 'superadmin' || $store.state.admin.type === 'storehouse'">
                    <template slot-scope="scope">

                        <el-button
                            size="mini"
                            type="warning"
                            @click.prevent="$store.commit('products/EDIT', scope.row)">
                            <icon icon="pencil-alt"/>
                        </el-button>

                        <el-button
                            size="mini"
                            type="danger"
                            @click.prevent="$store.dispatch('products/remove', scope.row._id.id)">
                            <icon icon="trash-alt"/>
                        </el-button>
                        <el-button
                            type="success"
                            size="mini"
                            @click.prevent="$store.commit('products/ADD_AMOUNT', {product: scope.row, add: true})">
                            <icon icon="plus"/>
                        </el-button>

                        <el-button
                            type="danger"
                            size="mini"
                            @click.prevent="$store.commit('products/ADD_AMOUNT', {product: scope.row, add: false})">
                            <icon icon="minus"/>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <product/>
        <add-amount/>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    import Product from './Product'
    import AddAmount from './AddAmount'

    export default {
        components: {
            Product,
            AddAmount
        },
        computed: {
            ...mapState('products', ['all'])
        },
        data () {
            return {
                toDate: new Date(),
                productName: ''
            }
        },
        methods: {
            search () {
                setTimeout(() => {
                    this.$store.dispatch('products/getAll', { all: '', toDate: this.toDate, productName: this.productName })
                }, 300)
            }
        },
        mounted () {
            this.$store.dispatch('products/getAll', { all: '', toDate: '', productName: this.productName })
        },
        watch: {
            'productName': 'search'
        }
    }
</script>
<style lang="sass">
    .el-button:nth-child(3)
        margin: 0
</style>

