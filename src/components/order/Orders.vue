<template>
    <div>
        <el-card>

            <el-row
                type="flex"
                justify="space-between"
                align="middle">
                    <h4>Պատվերներ</h4>
                    <el-button
                        v-if="$store.state.admin.type === 'superadmin' || $store.state.admin.type === 'storehouse' || $store.state.admin.type === 'secretary'"
                        type="primary"
                        plain
                        @click="$store.commit('orders/SHOW_ORDER_DIALOG')">
                            Ավելացնել
                    </el-button>
            </el-row>
                <div>
                    <template>
                        <p>
                            <span>Փնտրել</span>
                        </p>
                        <div class="block">
                          <span class="demonstration">Սկիզբ&nbsp;</span>
                          <el-date-picker
                              type="date"
                              v-model="fromDate"
                              @change="search"
                              placeholder="Ընտրեք օրը"/>
                        </div>
                        <div class="block">
                            <span class="demonstration">Մինչև&nbsp;</span>
                            <el-date-picker
                                type="date"
                                v-model="toDate"
                                @change="search"
                                placeholder="Ընտրեք օրը"/>
                        </div>
                        <div class="block">
                            <el-input
                            v-model="orderNumber"
                            placeholder="Պատվերի համարը"/>
                        </div>
                        <div class="block">
                          <el-input
                            v-model="clientName"
                            placeholder="Հաճախորդի անունը"/>
                        </div>
                        <div class="block">
                            <el-input
                            v-model="productName"
                            placeholder="Գույք"/>
                        </div>
                    </template>
                </div>
                <div>
                    <el-radio-group v-model="$store.state.orders.confirmedOrder">
                        <el-radio-button label="Նախնական"></el-radio-button>
                        <el-radio-button label="Հաստատված"></el-radio-button>
                    </el-radio-group>
                </div>

                <el-table
                  :data="orders"
                  stripe
                  border
                  style="width: 100%"
                  class="header-background">
                    <el-table-column type="expand" class="pd-0">
                        <template slot-scope="prop">
                            <el-row v-if="prop.row.info.confirmed">
                              <el-col :span="12">
                                <el-table :data="prop.row.products" stripe border>
                                  <el-table-column
                                    prop="product.name"
                                    label="Գույքի անվանումը">
                                  </el-table-column>

                                  <el-table-column
                                    prop="amount"
                                    label="Քանակ"/>

                                  <el-table-column
                                    label="Մնացորդ">
                                    <template slot-scope="scope" v-if="!scope.row.item.sold">
                                      {{ scope.row.amount - scope.row.acceptAmount }}
                                    </template>
                                  </el-table-column>

                                  <el-table-column
                                    label="Տեսակ">
                                    <template slot-scope="scope">
                                      <p v-if="scope.row.item.sold">Վաճառված</p>
                                      <p v-else>Վարձակալված</p>
                                    </template>
                                  </el-table-column>

                                  <el-table-column
                                    v-if="$store.state.admin.type === 'superadmin'"
                                    label="Գործողություններ">
                                    <template slot-scope="scope" v-if="!prop.row.info.closed">
                                      <el-button
                                        size="mini"
                                        v-if="scope.row.item.presentBalance > 0 && !scope.row.item.sold"
                                        @click.prevent="$store.commit('orders/ACCEPT_PRODUCT', { accept: scope.row, orderId: prop.row.info._id })"
                                        class="orderButton">
                                        Գույքի ընդունում
                                        <icon :icon="['far', 'edit']"/>
                                      </el-button>
                                    </template>
                                  </el-table-column>

                                </el-table>
                              </el-col>
                              <el-col :span="12" style="padding-left: 20px">
                                <el-table
                                  :key="key"
                                  v-for="(product, key) in prop.row.products"
                                  v-if="product.accepts.length"
                                  :data="product.accepts" border stripe
                                  style="margin-bottom: 20px">

                                  <el-table-column :label="`Գույք ${product.product.name}`">
                                  <el-table-column
                                    label="Օր">
                                    <template slot-scope="scope">
                                      {{ scope.row.acceptAt | formatedDate }}
                                    </template>
                                  </el-table-column>

                                  <el-table-column
                                    label="Սարքին"
                                    prop="normal"/>

                                  <el-table-column
                                    label="Ջարդված/կորուստ"
                                    prop="lost"/>

                                  <el-table-column
                                    label="Վնասված"
                                    prop="damaged"/>

                                </el-table-column>

                                </el-table>
                              </el-col>
                            </el-row>

                          <el-row v-else>
                            <el-col :span="24">
                              <el-table :data="prop.row.products" stripe border>
                                <el-table-column
                                  prop="product.name"
                                  label="Գույքի անվանումը">
                                </el-table-column>

                                <el-table-column
                                  prop="amount"
                                  label="Քանակ"/>

                                <el-table-column
                                  label="Մնացորդ">
                                  <template slot-scope="scope" v-if="!scope.row.item.sold">
                                    {{ scope.row.amount - scope.row.acceptAmount }}
                                  </template>
                                </el-table-column>

                                <el-table-column
                                  label="Տեսակ">
                                  <template slot-scope="scope">
                                    <p v-if="scope.row.item.sold">Վաճառված</p>
                                    <p v-else>Վարձակալված</p>
                                  </template>
                                </el-table-column>

                              </el-table>
                            </el-col>
                          </el-row>
                        </template>
                    </el-table-column>

                    <el-table-column
                        sortable
                        label="Վարձակալ"
                        prop="client.fullName"
                        width="200"/>

                    <el-table-column
                        label="Պատվեր #"
                        prop="info.number">
                    </el-table-column>

                    <el-table-column
                        sortable
                        label="Փակված"
                        width="110">
                        <template slot-scope="scope">
                            <span v-if="scope.row.info.closed">Այո</span>
                            <span v-else>Ոչ</span>
                        </template>
                    </el-table-column>


                    <el-table-column
                        sortable
                        label="Ընդհանուր գինը"
                        prop="info.totalPrice">
                        <template slot-scope="scope">
                            <span v-html="$store.state.replacedPrice(scope.row.info.totalPrice)"></span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        sortable
                        label="Ստեղծվել է">
                        <template slot-scope="scope">
                            <span v-html="$store.state.reformatDate(scope.row.createay)"></span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        v-if="$store.state.admin.type === 'superadmin' || $store.state.admin.type === 'storehouse'"
                        label="Գործողություններ"
                        :width="500">
                        <template slot-scope="scope">

                            <el-button
                                size="mini"
                                type="warning"
                                v-if="!scope.row.info.confirmed"
                                @click="$store.dispatch('orders/getOrder', { data: scope.row, page: `?page=${$route.query.page}` })"
                                class="orderButton">
                                    <icon icon="pencil-alt" />
                            </el-button>

                            <el-button
                                size="mini"
                                type="danger"
                                v-if="!scope.row.info.confirmed"
                                @click="$store.dispatch('orders/remove', {id: scope.row.info._id})"
                                class="orderButton">
                                    <icon icon="trash-alt" />
                            </el-button>

                            <div>
                                <el-checkbox
                                    v-if="$store.state.admin.type === 'superadmin' || $store.state.admin.type === 'storehouse'"
                                    v-model="scope.row.info.confirmed"
                                    @change="confirmOrder(scope.row)">
                                    Հաստատել
                                </el-checkbox>
                                <el-checkbox
                                    v-else
                                    v-model="scope.row.info.confirmed"
                                    :disabled="scope.row.info.confirmed"
                                    @change="confirmOrder(scope.row)">
                                    Հաստատել
                                </el-checkbox>
                                <a
                                    :href="getPrintUrl(scope.row.info._id, 'order')"
                                    class="orderPrintButton orderButton"
                                    target="_blank"
                                >
                                    Ակտ 1
                                    <span>
                                        <icon icon="print"></icon>
                                    </span>
                                </a>

                                <a
                                    :href="getPrintUrl(scope.row.info._id, 'order2')"
                                    class="orderPrintButton orderButton"
                                    target="_blank">Ակտ 2
                                    <span><icon icon="print"></icon></span>
                                </a>
                            </div>

                        </template>
                    </el-table-column>
                </el-table>
        </el-card>
        <accept/>
        <accepts/>
        <order/>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Order from './Order'
    import Accepts from '../home/Accepts'
    import Accept from './Accept'
    import moment from 'moment'

    export default {
        components: {
            Order,
            Accept,
            Accepts
        },
        data () {
            return {
                editable: false,
                fromDate: '',
                toDate: new Date(),
                clientName: '',
                productName: '',
                orderNumber: ''
            }
        },
        computed: {
            ...mapState('orders', ['orders', 'confirmedOrder', 'confirmed', 'dialogs'])
        },
        mounted () {
            this.$store.state.orders.confirmedOrder = 'Նախնական'
            this.$store.dispatch('orders/getAll', {
                fromDate: this.fromDate,
                toDate: this.toDate,
                orderNumber: this.orderNumber,
                clientName: this.clientName,
                productName: this.productName,
                confirmedOrder: ''
            })
            this.$store.dispatch('products/getAll', { all: '1', date: '' })
            this.$store.dispatch('clients/getAll')
            this.$store.state.home.clientId = ''
        },
        methods: {
            onConfirmChange () {
                let confirm = ''
                if (this.confirmedOrder === 'Հաստատված') confirm = true
                this.$store.state.orders.confirmed = confirm
                this.$store.dispatch('orders/getAll', {
                    fromDate: this.fromDate,
                    toDate: this.toDate,
                    orderNumber: this.orderNumber,
                    clientName: this.clientName,
                    productName: this.productName,
                    confirmedOrder: confirm
                })
            },
            getAccepts: function (id) {
                this.$store.state.home.orderId = id
                this.$store.dispatch('home/getAllAceptsByOrder')
            },
            getPrintUrl: function (orderId, orderNumber) {
                return `${this.$store.state.baseURL}/api/admin/pdf/${orderNumber}/${orderId}?auth_token=${localStorage.getItem('token')}`
            },
            search: function () {
                let confirm = ''
                if (this.confirmedOrder === 'Հաստատված') confirm = true

                let fromDate = this.fromDate || '2018-01-01'
                let toDate = this.toDate || new Date()

                setTimeout(() => {
                    this.$store.dispatch('orders/getAll', {
                        fromDate: fromDate,
                        toDate: toDate,
                        orderNumber: this.orderNumber,
                        clientName: this.clientName,
                        productName: this.productName,
                        confirmedOrder: confirm
                    })
                }, 300)
            },
            confirmOrder: async function (data) {
                this.$store.state.orders.confirmOrderButton = true

                await this.$store.dispatch('orders/getOrder', { data: data, page: `?page=${this.$route.query.page}` })
                await this.$store.dispatch('orders/submit')

                this.$store.state.orders.confirmOrderButton = false
            }
        },
        watch: {
            'clientName': 'search',
            'productName': 'search',
            'orderNumber': 'search',
            'confirmedOrder': 'onConfirmChange'
        },
        filters: {
            formatedDate: function (value) {
                return moment.utc(value).format('DD/MM/YYYY')
            }
        }
    }
</script>

<style lang="sass">
    .block
        float: left
        margin: 0 15px 25px 0
</style>
