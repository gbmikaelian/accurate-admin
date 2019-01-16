<template>
    <div>
        <el-dialog
            title="Վճարման պատմություն"
            width="100%"
            :visible.sync="$store.state.home.dialogs.paymentHistories">

            <el-row>
              <el-col :span="24">
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
              </el-col>

                <el-col :span="24">

                    <el-table
                        :data="[clientInfo]"
                        stripe
                        border
                        :show-header="false"
                        style="width: 100%">

                        <el-table-column
                            prop="client.fullName"/>
                        <el-table-column
                            prop="totalPrice">
                          <template slot-scope="scope">
                            <span v-html="$store.state.replacedPrice(scope.row.totalPrice)"></span>
                          </template>
                        </el-table-column>
                        <el-table-column
                            v-if="$store.state.admin.type === 'superadmin'">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="$store.commit('debts/REPAYMENT_HOME', {clientId: scope.row.client._id, clientDebt: scope.row.totalPrice})">
                                    Վճար
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                  <h1>Վճարման պատմություն</h1>
                </el-col>
                <el-col :span="16">
                    <h1>Պատվերներ</h1>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8" style="padding: 10px">

                    <el-table
                        :data="clientInfo.histories"
                        stripe
                        border
                        :show-header="true"
                        style="width: 100%"
                        class="header-background">

                        <el-table-column
                            label="Վճարման օր"
                            prop="createdAt">
                            <template slot-scope="scope">
                                {{ scope.row.createdAt | formatedDate }}
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="Գումար"
                            prop="paid">
                            <template slot-scope="scope">
                                <span v-html="$store.state.replacedPrice(scope.row.paid)"></span>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-col>

                <el-col :span="16" style="padding: 10px">

                    <el-radio-group v-model="type" style="margin-bottom: 15px">
                        <el-radio-button label="Ընթացիկ" value="Ընթացիկ"></el-radio-button>
                        <el-radio-button label="Փակված" value="Փակված"></el-radio-button>
                    </el-radio-group>

                  <el-table
                    :data="clientInfo.orders"
                    stripe
                    border
                    :show-header="true"
                    style="width: 100%"
                    class="header-background">

                    <el-table-column type="expand">
                        <template
                            slot-scope="prop"
                            v-if="$store.state.admin.type === 'superadmin'">
                            <el-row>
                                <el-col :span="12">
                                    <el-table
                                    :data="prop.row.products" border stripe>
                                    <el-table-column
                                      prop="product.name"
                                      label="Գույք"/>

                                    <el-table-column
                                      prop="amount"
                                      label="Քանակ"/>

                                    <el-table-column
                                      label="Մնացորդ">
                                      <template slot-scope="scope">
                                        {{ scope.row.amount - scope.row.acceptAmount }}
                                      </template>
                                    </el-table-column>

                                    <el-table-column
                                      v-if="$store.state.admin.type === 'superadmin'"
                                      label="Գործողություններ"
                                      :width="200">
                                      <template slot-scope="scope" v-if="!prop.row.info.closed">
                                        <el-button
                                          size="mini"
                                          v-if="scope.row.item.presentBalance > 0 && !scope.row.item.sold"
                                          @click.prevent="$store.commit('home/ACCEPT_PRODUCT_BY_CLIENT', { accept: scope.row, orderId: prop.row.info._id, clientId: clientInfo.client._id })"
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

                        </template>

                    </el-table-column>

                    <el-table-column
                        label="Պատվեր #"
                        prop="info.number" />

                    <el-table-column
                      label="Ստեղծվել է"
                      prop="info.createdAt">
                        <template slot-scope="scope">
                          {{ scope.row.info.createdAt | formatedDate }}
                        </template>
                    </el-table-column>

                    <el-table-column
                      label="Կանխավճար"
                      prop="info.deposit">
                      <template slot-scope="scope">
                        <span v-html="$store.state.replacedPrice(scope.row.info.deposit)"></span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="Արժեք"
                      prop="info.totalPrice">
                      <template slot-scope="scope">
                        <span v-html="$store.state.replacedPrice(scope.row.info.totalPrice)"></span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="Պարտք"
                      prop="totalPrice">
                        <template slot-scope="scope">
                            <span v-html="$store.state.replacedPrice(scope.row.totalPrice)"></span>
                        </template>
                    </el-table-column>

                    <el-table-column
                      label="Ինքնարժեք"
                      prop="costPrice">
                      <template slot-scope="scope">
                        <span v-html="$store.state.replacedPrice(scope.row.costPrice)"></span>
                      </template>
                    </el-table-column>

                    <el-table-column
                        v-if="$store.state.admin.type === 'superadmin'"
                        label="Գործողություններ"
                        width="200">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="warning"
                                v-if="!scope.row.info.confirmed"
                                @click="editOrder(scope.row)"
                                class="orderButton">
                                    <icon icon="pencil-alt" />
                            </el-button>

                            <el-button
                                size="mini"
                                type="danger"
                                v-if="!scope.row.info.confirmed"
                                @click="removeOrder(scope.row.info._id)"
                                class="orderButton">
                                    <icon icon="trash-alt" />
                            </el-button>
                            <a
                                :href="getPrintUrl(scope.row.info._id, 'order')"
                                class="orderPrintButton orderButton"
                                target="_blank">
                                Ակտ 1
                                <span><icon icon="print"></icon></span>
                            </a>
                            <a
                                :href="getPrintUrl(scope.row.info._id, 'order2')"
                                class="orderPrintButton orderButton"
                                target="_blank">Ակտ 2
                              <span><icon icon="print"></icon></span>
                            </a>
                        </template>
                    </el-table-column>

                  </el-table>
                </el-col>
            </el-row>

        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
    computed: {
        ...mapState('home', ['clientInfo', 'dialogs'])
    },
    methods: {
        getAccepts: function (id) {
            this.$store.state.home.orderId = id
            this.$store.dispatch('home/getAllAceptsByOrder')
        },
        onTypeChange: function () {
            let fromDate = this.fromDate || '2018-01-01'
            let toDate = this.toDate || new Date()

            if (this.type === 'Ընթացիկ') {
                this.$store.dispatch('home/getAllHistoriesByClient', {type: 'current', fromDate: fromDate, toDate: toDate})
            } else {
                this.$store.dispatch('home/getAllHistoriesByClient', {type: 'closed', fromDate: fromDate, toDate: toDate})
            }
        },
        onOpen: function () {
            if (this.dialogs.paymentHistories) {
                this.type = 'Ընթացիկ'
            }
        },
        editDates: function () {
            let fromDate = this.fromDate || '2018-01-01'
            let toDate = this.toDate || new Date()

            if (this.type === 'Ընթացիկ') {
                this.$store.dispatch('home/getAllHistoriesByClient', { type: 'current', fromDate: fromDate, toDate: toDate })
            } else {
                this.$store.dispatch('home/getAllHistoriesByClient', {type: 'closed', fromDate: fromDate, toDate: toDate})
            }
        },
        removeOrder: async function (id) {
            let fromDate = this.fromDate || '2018-01-01'
            let toDate = this.toDate || new Date()

            this.$store.state.home.clientId = this.clientInfo.client._id
            await this.$store.dispatch('orders/remove', {id})
            await Promise.all([
                this.$store.dispatch('home/getAllHistoriesByClient', { type: 'current', fromDate: fromDate, toDate: toDate }),
                this.$store.dispatch('home/getAllClient', { fromDate: '', toDate: '', page: this.$store.state.home.currentPage }),
                this.$store.dispatch('home/getAllRentedProducts', { toDate: '' })
            ])
        },
        editOrder: async function (data) {
            console.log(data)
            this.$store.state.home.clientId = this.clientInfo.client._id
            await this.$store.dispatch('orders/getOrder', {data})
        },
        getPrintUrl: function (orderId, orderNumber) {
            return `${this.$store.state.baseURL}/api/admin/pdf/${orderNumber}/${orderId}?auth_token=${localStorage.getItem('token')}`
        }
    },
    data () {
        return {
            type: 'Ընթացիկ',
            fromDate: '',
            toDate: new Date()
        }
    },
    watch: {
        'type': 'onTypeChange',
        'dialogs.paymentHistories': 'onOpen'
    },
    filters: {
        formatedDate: function (value) {
            return moment.utc(value).format('DD/MM/YYYY')
        }
    }
}
</script>
