<template>
    <div>
        <el-dialog
            title="Գույք"
            width="90%"
            :visible.sync="$store.state.home.dialogs.products">
            <el-radio-group v-model="type">
                <el-radio-button label="Ընթացիկ" value="Ընթացիկ"></el-radio-button>
                <el-radio-button label="Փակված" value="Փակված"></el-radio-button>
                <el-radio-button label="Վաճառված" value="Վաճառված"></el-radio-button>
            </el-radio-group>
             <p>
                <span>Փնտրել</span>
            </p>
            <el-input
                v-model="productName"
                style="width:250px;margin-bottom:20px"
                placeholder="Գույքի անվանում">
            </el-input>

          <el-table
            :data="productsByClient"
            stripe
            border
            style="width: 100%"
            class="header-background">
            <el-table-column
              label="Անվանում"
              prop="info.name">
              <template slot-scope="scope">
                <a
                  href=""
                  v-if="scope.row !== null"
                  @click.prevent="getOrders(scope.row.client._id, scope.row._id)">
                  {{ scope.row.info.name}}
                </a>
              </template>
            </el-table-column>

            <el-table-column
              label="Քանակ"
              prop="totalRentedAmount"/>
          </el-table>

        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState('home', [
                'productsByClient',
                'dialogs'
            ])
        },
        methods: {
            onTypeChange: function () {
                let type = ''
                if (this.type === 'Ընթացիկ') {
                    type = 'current'
                } else if (this.type === 'Փակված') {
                    type = 'closed'
                } else {
                    type = 'sold'
                }
                this.$store.dispatch('home/getAllProductsByClient', { type: type, productName: '' })
            },
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
            onOpen: function () {
                if (this.dialogs.products) {
                    this.type = 'Ընթացիկ'
                }
            },
            onproductNameChange: function () {
                let type = ''
                if (this.type === 'Ընթացիկ') {
                    type = 'current'
                } else if (this.type === 'Փակված') {
                    type = 'closed'
                } else {
                    type = 'sold'
                }
                setTimeout(() => {
                    this.$store.dispatch('home/getAllProductsByClient', { type: type, productName: this.productName })
                }, 300)
            }
        },
        data () {
            return {
                type: 'Ընթացիկ',
                productName: ''
            }
        },
        watch: {
            'type': 'onTypeChange',
            'dialogs.products': 'onOpen',
            'productName': 'onproductNameChange'
        }
    }
</script>
