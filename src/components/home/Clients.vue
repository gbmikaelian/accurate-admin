<template>
    <div>
        <el-dialog
            label-position="top"
            title="Վարձակալ"
            width="90%"
            :visible.sync="$store.state.home.dialogs.clients">
                <el-radio-group v-model="type">
                    <el-radio-button label="Ընթացիկ" value="Ընթացիկ"></el-radio-button>
                    <el-radio-button label="Փակված" value="Փակված"></el-radio-button>
                    <el-radio-button label="Վաճառված" value="Վաճառված"></el-radio-button>
                </el-radio-group>
            <p>
                <span>Փնտրել</span>
            </p>
            <el-input
                v-model="clientName"
                style="width:250px;margin-bottom:20px"
                placeholder="Անուն">
            </el-input>

            <el-table
                :data="clientsByprod"
                stripe
                border
                style="width: 100%"
                class="header-background">

                <el-table-column
                    label="Անուն"
                    prop="info.firstName">
                    <template slot-scope="scope">
                        <a
                            href=""
                            @click.prevent="getOrders(scope.row._id, scope.row.product._id)">
                            {{ scope.row.info.fullName }}
                        </a>
                    </template>
                </el-table-column>

                <el-table-column
                    label="Ընդհանուր վարձակալության քանակ"
                    prop="totalRentedAmount"/>

                <!--<el-table-column-->
                    <!--label="Պարտք"-->
                    <!--prop=""/>-->

            </el-table>

        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState('home', ['clientsByprod', 'dialogs'])
        },
        methods: {
            getOrders (clientId, productId) {
                let type = ''
                if (this.type === 'Ընթացիկ') {
                    type = 'current'
                } else if (this.type === 'Փակված') {
                    type = 'closed'
                } else {
                    type = 'sold'
                }
                this.$store.state.home.clientId = clientId
                this.$store.state.home.productId = productId
                this.$store.state.home.orderType = type
                this.$store.dispatch('home/getOrdersByClientAndproduct', { type: type, fromDate: '', toDate: new Date() })
            },
            onTypeChange: function () {
                let type = ''
                if (this.type === 'Ընթացիկ') {
                    type = 'current'
                } else if (this.type === 'Փակված') {
                    type = 'closed'
                } else {
                    type = 'sold'
                }
                this.$store.dispatch('home/getAllClientsByProd', { type: type, clientName: '' })
                console.log(this.type)
            },
            onOpen: function () {
                if (this.dialogs.clients) {
                    this.type = 'Ընթացիկ'
                }
            },
            onClientNameChange: function () {
                let type = ''
                if (this.type === 'Ընթացիկ') {
                    type = 'current'
                } else if (this.type === 'Փակված') {
                    type = 'closed'
                } else {
                    type = 'sold'
                }
                setTimeout(() => {
                    this.$store.dispatch('home/getAllClientsByProd', { type: type, clientName: this.clientName })
                }, 300)
            }
        },
        data () {
            return {
                type: 'Ընթացիկ',
                clientName: ''
            }
        },
        watch: {
            'type': 'onTypeChange',
            'dialogs.clients': 'onOpen',
            'clientName': 'onClientNameChange'
        }
    }
</script>
