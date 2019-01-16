<template>
    <div class="homePage">
      <div
          class="userPaginate"
          id="userPaginate">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :current-page="currentPage"
            :page-size="Number(20)"
            :total="Number(clients.count)">
          </el-pagination>
      </div>
      <div class="homeDateInput">
        <span class="demonstration">Սկիզբ</span>
        <el-date-picker
          v-model="fromDate"
          @change ="editDates"
          type="date"
          placeholder="Ընտրեք օրը">
        </el-date-picker>
      </div>

      <div class="homeDateInput">
        <span class="demonstration">Վերջ</span>
        <el-date-picker
          v-model="toDate"
          @change ="editDates"
          type="date"
          placeholder="Ընտրեք օրը">
        </el-date-picker>
      </div>

      <div class="homePrintButton"
        v-if="this.$store.state.admin.type === 'superadmin'">
        <a
            :href="getPrintUrl()"
            target="_blank">
            Տպել
          <span><icon icon="print"></icon></span>
        </a>
      </div>

      <div class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x el-table--enable-row-transition homeTable">

        <table border="0" class="table header-background">

          <thead class="has-gutter">
          <tr class="">
            <th colspan="1" rowspan="2">
              <div class="cell text-center">Գույք</div>
            </th>
            <th colspan="3" rowspan="1">
              <div class="cell text-center">Ընդհանուր</div>
            </th>
            <th colspan="2" rowspan="1">
              <div class="cell text-center">Առկա</div>
            </th>
            <th colspan="1" rowspan="2" class="rotate">
              <div>Ամրագրված</div>
            </th>
            <th colspan="1" rowspan="2" class="rotate">
              <div>Վնասված</div>
            </th>
            <th colspan="1" rowspan="2" class="rotate">
              <div>Վարձակալված</div>
            </th>
            <th colspan="1" rowspan="2" class="rotate">
              <div>Վաճառված</div>
            </th>
            <th colspan="1" rowspan="2"
              v-for="(client, key) in clients.data"
              :key="key"
              class="rotate">
              <div class="clientName">

                <a
                  @click.prevent="getClientInfo(client._id)">
                    {{ client.fullName }}
                </a>
              </div>
            </th>
          </tr>
          <tr>
            <th colspan="1" rowspan="1" class="rotate rotateBott">
              <div>Ընդհանուր</div>
            </th>
            <th colspan="1" rowspan="1" class="rotate rotateBott">
              <div>Նոր</div>
            </th>
            <th colspan="1" rowspan="1" class="rotate rotateBott">
              <div>Օգտագործած</div>
            </th>
            <th colspan="1" rowspan="1" class="rotate rotateBott">
              <div>Նոր</div>
            </th>
            <th colspan="1" rowspan="1" class="rotate rotateBott">
              <div>Օգտագործած</div>
            </th>
          </tr>
          </thead>

          <tbody>
            <tr v-for="product in products" class="el-table__row">
              <td>
                <div class="cell">
                  <a
                    @click.prevent="getClients(product.product._id)">{{ product.product.name }}
                  </a>
                </div>
              </td>
              <td><div>{{ product.amount.totalAmount }}</div></td>
              <td><div>{{ product.amount.totalAmountNew }}</div></td>
              <td><div>{{ product.amount.totalAmountUsed }}</div></td>
              <td><div>{{ product.amount.availableAmountNew }}</div></td>
              <td><div>{{ product.amount.availableAmountUsed }}</div></td>
              <td><div>{{ product.amount.totalReserveAmount }}</div></td>
              <td><div>{{ product.amount.acceptedDamagedAmount }}</div></td>
              <td><div v-if="">{{ product.amount.totalRentedAmount }}</div></td>
              <td><div>{{ product.amount.soldAmount }}</div></td>
              <td v-for="client in clients.data">
                <div v-if="client.products[product.product.name] && client.products[product.product.name].totalRentedAmount">
                  <a
                    @click.prevent="getOrders(client._id, client.products[product.product.name]._id)">
                  {{client.products[product.product.name].totalRentedAmount}}
                  </a>
                </div>
              </td>
            </tr>
          </tbody>

        </table>

      </div>



        <orders/>
        <clients/>
        <products/>
        <payment-histories/>
        <debt/>
        <order/>
    </div>
</template>

<script>
    import Orders from './Orders'
    import Clients from './Clients'
    import Products from './Products'
    import PaymentHistories from './PaymentHistories'
    import Debt from '../debt/Debt'
    import Order from '../order/Order.vue'
    import { mapState } from 'vuex'
    export default {
        components: {
            Orders,
            Clients,
            Products,
            PaymentHistories,
            Debt,
            Order
        },
        computed: {
            ...mapState('home', ['products', 'clients'])
        },
        methods: {
            getClients: function (id) {
                this.$store.state.home.clientId = ''
                this.$store.commit('home/SET_PRODUCT_ID', id)
                this.$store.dispatch('home/getAllClientsByProd', { type: 'current', clientName: '' })
            },
            getClientInfo: function (id) {
                this.$store.state.home.productId = ''
                this.$store.commit('home/SET_CLIENT_ID', id)
                this.$store.dispatch('home/getAllHistoriesByClient', { type: 'current', fromDate: '', toDate: '' })
            },
            getOrders: function (clientId, productId) {
                this.$store.state.home.clientId = clientId
                this.$store.state.home.productId = productId
                this.$store.dispatch('home/getOrdersByClientAndproduct', { type: 'current', fromDate: '', toDate: new Date() })
            },
            editDates: function () {
                let fromDate = this.fromDate || '2018-01-01'
                let toDate = this.toDate || new Date()

                this.$store.dispatch('home/getAllRentedProducts', { toDate: toDate })
                this.$store.dispatch('home/getAllClient', { fromDate: fromDate, toDate: toDate, page: '1' })
            },
            handleCurrentChange: function (val) {
                let fromDate = this.fromDate || '2018-01-01'
                let toDate = this.toDate || new Date()

                this.$store.dispatch('home/getAllClient', { fromDate: fromDate, toDate: toDate, page: val })

                this.currentPage = Number(val)

                this.$store.state.home.currentPage = Number(val)
            },
            getPrintUrl: function () {
                let fromDate = this.fromDate || '2018-01-01'

                let toDate = this.toDate || new Date()

                return `${this.$store.state.baseURL}/api/admin/pdf/home?page=${this.currentPage}&from_date=${fromDate}&to_date=${toDate}&auth_token=${localStorage.getItem('token')}`
            },
            paginateFix: function () {
                let header = document.getElementById('userPaginate')
                let sticky = header.offsetTop
                if (window.pageYOffset - 120 > sticky) {
                    header.classList.add('sticky')
                    console.log(sticky)
                } else if (window.pageYOffset - 120 < sticky) {
                    header.classList.remove('sticky')
                }
            }
        },
        data () {
            return {
                fromDate: '',
                toDate: new Date(),
                currentPage: 1
            }
        },
        mounted () {
            this.$store.dispatch('clients/getAll')
            this.$store.dispatch('home/getAllRentedProducts', { toDate: this.toDate })
            this.$store.dispatch('home/getAllClient', { fromDate: this.fromDate, toDate: this.toDate, page: this.crrentPage })
        },
        created () {
            window.addEventListener('scroll', this.paginateFix)
        },
        destroyed () {
            window.removeEventListener('scroll', this.paginateFix)
        }
}
</script>
