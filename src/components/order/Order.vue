<template>
    <div>
        <el-dialog
            title="Պատվեր"
            width="90%"
            :visible.sync="$store.state.orders.dialogs.order">

            <el-form>
                <el-form-item label="Վարձակալ" :label-width="formLabelWidth">
                    <el-select
                        @change="callClient(order.client)"
                        v-model="order.client"
                        filterable
                        placeholder="Ընտրեք">
                        <el-option
                            v-for="client in $store.state.clients.clients"
                            :label="client.fullName"
                            :value="client._id"
                            :key="client._id">
                                {{client.fullName}}
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="Կանխավճար"
                    :label-width="formLabelWidth">
                        <el-input
                            v-model="order.deposit"/>
                </el-form-item>

                <el-form-item
                    label="Հաստատել"
                    :label-width="formLabelWidth">
                    <el-checkbox 
                     v-if="$store.state.admin.type === 'secretary'"
                    v-model="order.confirmed"
                    :disabled="true">
                    Հաստատել
                    </el-checkbox>

                    <el-checkbox
                    v-else
                    v-model="order.confirmed">
                    Հաստատել
                    </el-checkbox>
                </el-form-item>

                <el-form-item
                    label="Առաքման հասցե"
                    :label-width="formLabelWidth">
                    <el-input
                        type="text"
                        v-model="order.address1"/>
                </el-form-item>

                <el-form-item
                    label="Առաքվող վայրի հասցե"
                    :label-width="formLabelWidth">
                    <el-input
                        type="text"
                        v-model="order.address2"/>
                </el-form-item>

                <el-form-item
                    label="Ստեղծման օր"
                    :label-width="formLabelWidth">
                        <el-date-picker
                            v-model="order.createdDay"
                            type="date"
                            placeholder="Pick a day">
                        </el-date-picker>
                </el-form-item>

                <el-form-item
                    label="Առաքման տեսակ"
                    :label-width="formLabelWidth">
                    <el-input
                        type="text"
                        v-model="shippingmethod"/>
                </el-form-item>

                <el-form-item
                    label="Առաքման ժամ"
                    :label-width="formLabelWidth">
                    <el-time-select
                        style="width:250px"
                        v-model="shippingTime"
                        placeholder="Ընտրեք ժամը"/>
                </el-form-item>

                <el-form-item
                    label="Ընդհանուր զեղչ"
                    :label-width="formLabelWidth">
                        <el-input
                            v-model="order.totalSale"/>
                </el-form-item>

                <el-form-item
                    label="Գույք"
                    :label-width="formLabelWidth">
                    <el-select
                        @change="$store.dispatch('orders/getOne', order.productOption)"
                        v-model="order.productOption"
                        filterable
                        placeholder="Ընտրեք">
                        <el-option
                            v-for="(product, key) in $store.state.products.all"
                            :key="key"
                            :label="product.name"
                            :value="product._id"/>
                    </el-select>
                </el-form-item>
                
            </el-form>

            <el-table
                border
                stripe
                :data="order.products"
                style="width: 100%">

               <el-table-column
                    label="Գույքի անվանումը"
                    width="300">
                    <template slot-scope="scope">
                        <div
                            v-for="(product, key) in $store.state.products.all"
                            v-if="scope.row.product === product._id"
                            v-bind:key="key">
                                {{ product.name }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                        label="Քանակ"
                        prop="new.amount">
                        <template slot-scope="scope">
                            <el-input
                            min="0"
                            type="number"
                                v-model="scope.row.amount"/>
                        </template>
                </el-table-column>

                <el-table-column
                        label="Հասանելի քանակ">
                    <template slot-scope="scope">
                        <span style="font-size: 20px; color: red">
                            {{scope.row.availableAmount}}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="Արժեք"
                        prop="new.cost">
                        <template slot-scope="scope">
                            <el-input
                            
                                v-model="scope.row.cost"/>
                        </template>
                </el-table-column>

                <el-table-column
                        label="Վիճակ">
                        <template slot-scope="scope">
                            <el-radio-group v-model="scope.row.used"
                                    @change="$store.dispatch('orders/getProduct', {
                                        id: scope.row.product,
                                        type: scope.row.used,
                                        sold: scope.row.sold,
                                        index: scope.$index
                                    })">
                                    <el-radio :label="false">Նոր</el-radio><br>
                                    <el-radio :label="true">Օգտագործված</el-radio>
                            </el-radio-group>
                        </template>
                </el-table-column>



                <el-table-column
                        label="Տեսակ"
                        prop="new.sold"
                        width="200px">
                            <template slot-scope="scope">
                                <el-radio-group v-model="scope.row.sold"
                                    @change="$store.dispatch('orders/getProduct', {
                                        id: scope.row.product,
                                        type: scope.row.used,
                                        sold: scope.row.sold,
                                        index: scope.$index
                                    })">
                                    <el-radio :label="true">Վաճառք</el-radio><br>
                                    <el-radio :label="false">Վարձակալություն</el-radio>
                                </el-radio-group>
                            </template>
                    </el-table-column>

                <el-table-column
                    label="Զեղչ %"
                    prop="sale"
                    width="100">
                    <template slot-scope="scope">
                        <el-input class="sold" v-model="scope.row.sale"></el-input>
                    </template>
                </el-table-column>

                <el-table-column
                    label="Ջնջել"
                    width="120">
                    <template slot-scope="scope">
                        <el-button
                            type="danger"
                            @click="$store.commit('orders/REMOVE_PRODUCT', scope.$index)">
                            <icon icon="trash-alt" />
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button
                    @click="$store.state.orders.dialogs.order = false">
                    Չեղարկել
                </el-button>

                <el-button
                    type="primary"
                    v-if="order._id"
                    :loading="$store.state.buttonLoading"
                    @click="submit">
                    Պահպանել
                </el-button>

                <el-button
                    type="primary"
                    :loading="$store.state.buttonLoading"
                    v-else
                    @click="addSubmit">
                    Ավելացնել
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { Message } from 'element-ui'
    export default {
        data () {
            return {
                shippingTime: '',
                shippingmethod: '',
                formLabelWidth: '150px'
            }
        },
        computed: {
            ...mapState('orders', [
                'order',
                'includeProducts',
                'productPrices',
                'confirmedOrder'
            ])
        },
        watch: {
            'order.totalSale': 'orderSale'
        },
        methods: {
            showInput (visible) {
                this.tags[visible] = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            orderSale (sale) {
                this.order.products.filter(el => {
                    el.sale = sale
                })
            },
            callClient (clientId) {
                let client = this.$store.state.clients.clients.filter(el => {
                    return el._id === clientId
                })
                if (client && client[0].clientBlackList) {
                    Message.error({message: 'Հաճախորդը գտնվքում է սև ցուցակում'})
                }
                this.order.address1 = client[0].address
            },
            submit: async function () {
                await this.$store.dispatch('orders/submit')
                if (this.$store.state.home.clientId) {
                    await Promise.all([
                        this.$store.dispatch('home/getAllHistoriesByClient', { type: 'current', fromDate: '', toDate: '' }),
                        this.$store.dispatch('home/getAllClient', { fromDate: '', toDate: '', page: this.$store.state.home.currentPage }),
                        this.$store.dispatch('home/getAllRentedProducts', { toDate: '' })
                    ])
                }
            },
            addSubmit () {
                this.$store.state.orders.confirmedOrder = 'Նախնական'
                this.$store.dispatch('orders/submit')
            }
        }
    }
</script>

<style lang="sass">
    .el-form
        margin-top: 20px
    .el-dropdown-link
        cursor: pointer
        color: #409eff
    .el-form-item .el-input
        width: 250px
    .el-icon-arrow-down
        font-size: 12px
    
</style>
<style>
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
        -webkit-appearance: none!important;
        margin: 0!important; /* <-- Apparently some margin are still there even though it's hidden */
    }
</style>

