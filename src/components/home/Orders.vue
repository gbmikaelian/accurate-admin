<template>
    <div>
        <el-dialog
            title="Պատվերներ"
            width="90%"
            :visible.sync="$store.state.home.dialogs.orders">
          <div>
            <el-form>
              <h1>
              <el-form-item
                v-if="orders.client"
                style="color: blue"
                label="Վարձակալ">
                {{ orders.client.fullName }}
              </el-form-item>
              </h1>
            </el-form>
          </div>
          <el-row>
              <div class="block" style="float: left; margin: 0  20px 20px 0 ">
                <span class="demonstration">Սկիզբ</span>
                <el-date-picker
                  v-model="fromDate"
                  @change ="editDates"
                  type="date"
                  placeholder="Ընտրեք օրը">
                </el-date-picker>
              </div>
              <div class="block">
                <span class="demonstration">Վերջ</span>
                <el-date-picker
                  v-model="toDate"
                  @change ="editDates"
                  type="date"
                  placeholder="Ընտրեք օրը">
                </el-date-picker>
              </div>
          </el-row>
          <el-row>
              <el-col :span="14">
                  <el-table
                :data="orders.orders"
                stripe
                border
                :show-header="true"
                style="width: 100%"
                class="header-background">
                <el-table-column
                    label="Պատվեր #"
                    prop="info.number" />

                <el-table-column
                    label="Քանակ"
                    prop="totalAmount"/>

                <el-table-column
                    label="Ստեղծվել է">
                    <template slot-scope="scope">
                        {{ scope.row.info.createdDay | formatedDate }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="Մնացորդ"
                    prop="totalRentedAmount">
                </el-table-column>

                <el-table-column
                    v-if="$store.state.admin.type === 'superadmin'"
                    label="Գործողություններ"
                    :width="355">
                    <template slot-scope="scope">
                        <el-button
                            v-if=" scope.row.totalRentedAmount > 0 && !scope.row.info.closed && !scope.row.sold && scope.row.info.confirmed"
                            size="mini"
                            @click.prevent="$store.commit('home/ACCEPT_PRODUCT', scope.row)"
                            class="orderButton">
                                Գույքի ընդունում
                                <icon :icon="['far', 'edit']"/>
                        </el-button>
                      <a :href="getPrintUrl(scope.row._id, 'order')"
                         class="orderPrintButton orderButton"
                         target="_blank">Ակտ 1
                        <span><icon icon="print"></icon></span>
                      </a>
                      <a :href="getPrintUrl(scope.row._id, 'order2')"
                         v-if="!scope.row.sold"
                         class="orderPrintButton orderButton"
                         target="_blank">Ակտ 2
                        <span><icon icon="print"></icon></span>
                      </a>
                    </template>
                </el-table-column>
            </el-table>
              </el-col>
              <el-col :span="10" style="padding-left: 20px">
                <el-table
                    :key="key"
                    v-for="(order, key) in orders.orders"
                    v-if="order.accepts[0].length"
                    :data="order.accepts[0]"
                    stripe
                    border
                    :show-header="true"
                    style="width: 100%; margin-bottom: 20px"
                    class="header-background">

                    <el-table-column :label="`Պատվեր # ${order.info.number}`">

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
        </el-dialog>

        <accepts/>
        <accept/>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Accepts from './Accepts'
    import Accept from './Accept'

    import moment from 'moment'

    export default {
        components: {
            Accepts,
            Accept
        },
        computed: {
            ...mapState('home', ['orders', 'orderType', 'dialogs'])
        },
        methods: {
            getAccepts: function (id) {
                this.$store.state.home.itemId = id
                this.$store.dispatch('home/getAllAceptsByItem')
            },
            editDates: function () {
                let fromDate = this.fromDate || '2018-01-01'
                let toDate = this.toDate || new Date()

                this.$store.dispatch('home/getOrdersByClientAndproduct', { type: this.orderType, fromDate: fromDate, toDate: toDate })
            },
            onOpen: function () {
                this.date = new Date()
            },
            getPrintUrl: function (orderId, orderNumber) {
                return `${this.$store.state.baseURL}/api/admin/pdf/${orderNumber}/${orderId}?auth_token=${localStorage.getItem('token')}`
            }
        },
        data () {
            return {
                fromDate: '',
                toDate: new Date()
            }
        },
        mounted () {
            this.$store.dispatch('products/getAll', {all: 'all=1', date: ''})
        },
        watch: {
            'dialogs.orders': 'onOpen'
        },
        filters: {
            formatedDate: function (value) {
                return moment.utc(value).format('DD/MM/YYYY')
            }
        }
    }
</script>
