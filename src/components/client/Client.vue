<template>
    <div>
        <el-dialog
            title="Վարձակալ"
            width="70%"
            :visible.sync="$store.state.clients.dialogs.client">
            <el-form>
                <el-form-item
                    :label-width="formLabelWidth"
                    label="ԱԱՀ">
                    <el-input
                        v-model="client.fullName"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Անձնագրի NO.">
                    <el-input
                        v-model="client.passportNo"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Տրված է">
                    <el-input
                        v-model="client.passportGivenFrom"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Տրվման տարեթիվը">
                    <el-input
                        v-model="client.passportGivenDate"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="ՀՎՀՀ">
                    <el-input
                        v-model="client.hvhh"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Հասցե">
                    <el-input
                        v-model="client.address"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Բանկ">
                    <el-input
                        v-model="client.bank"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Բանկային հաշվեհամար">
                    <el-input
                        v-model="client.bankAccountNo"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Տնօրեն">
                    <el-input
                        v-model="client.director"
                        auto-complete="off"/>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Սև ցուցակի օրեր">
                    <el-input
                        v-model="client.blackList"
                        placeholder="Օրեր"/>
                </el-form-item>

                <el-form-item
                    label="Հեռախոսահամարներ"
                    :label-width="'170px'">
                    <el-tag
                        v-for="number in client.phoneNumbers"
                        :key="number"
                        :disable-transitions="false"
                        @close="$store.commit('clients/HANDLE_CLOSE', { tag: number, column: 'phoneNumbers' })"
                        closable>
                            {{number}}
                    </el-tag>

                    <el-input
                        class="input-new-tag"
                        v-if="tags.phoneNumberVisible"
                        v-model="tags.phoneNumber"
                        ref="saveTagInput"
                        size="mini"
                        @change="$store.commit('clients/SET_TAGS', { column: 'phoneNumber' })"
                        @keyup.enter.native="$store.commit('clients/SET_TAGS', {column: 'phoneNumber'})"/>
                    <el-button
                        v-else
                        class="button-new-tag"
                        size="small"
                        @click="showInput('phoneNumberVisible')">
                            + Նոր համար
                    </el-button>
                </el-form-item>
                <el-form-item
                    :label-width="formLabelWidth"
                    label="Ջնջված է">
                    <el-checkbox v-model="client.deleted"/>
                </el-form-item>
                <el-form-item
                    :label-width="formLabelWidth"
                    label="Տեսակ">
                    <el-select
                        v-model="client.type"
                        placeholder="Ընտրեք">
                        <el-option
                            v-for="item in types"
                            :key="item"
                            :label="item"
                            :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label-width="formLabelWidth"
                    label="Կանգնեցված ապրանք">
                    <el-table
                        style="width: 100%"
                        :data="client.stopProducts">
                        <el-table-column
                        label="Անվանում"
                        :label-width="formLabelWidth"
                        prop="name"/>

                        <el-table-column
                            label="Մեկնարկի օր"
                            :label-width="formLabelWidth">
                            <template slot-scope="scope">
                                <el-date-picker
                                    v-model="scope.row.startDate"
                                    type="date"
                                    placeholder="Pick a day"/>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="Ավարտի օր"
                            :label-width="formLabelWidth">
                            <template slot-scope="scope">
                                <el-date-picker
                                    v-model="scope.row.endDate"
                                    type="date"
                                    placeholder="Pick a day"/>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Ապրանքներ">
                    <template slot-scope="scoope">
                        <el-select
                            v-model="product"
                            @change="stopProduct(product)"
                            placeholder="Ընտրեք">
                            <el-option
                                v-for="rentedProduct in rentedProducts"
                                :key="rentedProduct.info.name"
                                :label="rentedProduct.info.name"
                                :value="rentedProduct.info._id">
                                    {{rentedProduct.info.name}}
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>

                <el-form-item
                    :label-width="formLabelWidth"
                    label="Պայմանգիր">
                    <el-select
                        v-model="client.contract"
                        placeholder="Ընտրեք պայմանագիրը">
                        <el-option
                            v-for="contract in contracts"
                            :key="`contract-${contract._id}`"
                            :value="contract._id">
                                {{ contract.name }}
                        </el-option>
                    </el-select>
                    <a
                        :href="getPrintUrl()"
                        target="_blank">
                        <el-button
                            type="default">
                            Տպել
                        </el-button>
                    </a>
                </el-form-item>
            </el-form>

            <span
                slot="footer"
                class="dialog-footer">
                <el-button
                    @click="$store.state.clients.dialogs.client = false">
                        Չեղարկել
                </el-button>
                <el-button
                    type="primary"
                    :loading="$store.state.buttonLoading"
                    v-if="client._id"
                    @click="$store.dispatch('clients/submit')">
                        Պահպանել
                </el-button>
                <el-button
                    type="primary"
                    :loading="$store.state.buttonLoading"
                    v-else
                    @click="$store.dispatch('clients/submit')">
                        Ավելացնել
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        data () {
            return {
                product: '',
                contract: '',
                products: [],
                stopProducts: [{ product: 'dshsdhsdh', startDate: '', endDate: '' }],
                formLabelWidth: '150px',
                types: ['llc', 'sole', 'owned']
            }
        },
        computed: {
            ...mapState('clients', [
                'client',
                'tags',
                'rentedProducts'
            ]),
            ...mapState('contracts', [
                'contracts'
            ])
        },
        methods: {
            showInput: function (visible) {
                this.tags[visible] = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            stopProduct: function (productId) {
                let productName = this.rentedProducts.filter(el => {
                    return el.info._id === productId
                })

                this.$store.state.clients.client.stopProducts.push({
                    name: productName[0].info.name,
                    product: productId,
                    startDate: '',
                    endDate: ''
                })
            },
            getPrintUrl: function () {
                return `${window.location.protocol}//${window.location.hostname}:4008/api/admin/contracts/print/${this.client._id}?auth_token=${localStorage.getItem('token')}`
            }
        },
        mounted () {
            this.$store.dispatch('contracts/getAll')
        }
    }
</script>
