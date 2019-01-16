<template>
  <div>
  <el-dialog
    title="Պատվերներ"
        width="60%"
        :visible.sync="$store.state.debts.dialogs.orders">
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
            <el-table
                border
                :data="orders"
                stripe
                style="width: 100%"
                class="header-background">
                    <el-table-column
                        label="Թիվ"
                        prop="info.number"/>

                    <el-table-column
                        label="Վաճառված գին"
                        prop="soldPrice">
                        <template slot-scope="scope">
                            <span v-html="$store.state.replacedPrice(scope.row.soldPrice)"></span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="Վարձակալած գին"
                        width="160px"
                        prop="rentedPrice">
                      <template slot-scope="scope">
                        <span v-html="$store.state.replacedPrice(scope.row.rentedPrice)"></span>

                      </template>
                    </el-table-column>

                    <el-table-column
                        label="Ընդհանուր գին"
                        prop="totalPrice">
                      <template slot-scope="scope">
                        <span v-html="$store.state.replacedPrice(scope.row.totalPrice)"></span>
                      </template>
                    </el-table-column>

                    <el-table-column
                        width="170px"
                        label="Կարգավիճակ">
                        <template slot-scope="scope">
                            <span v-if="scope.row.info.closed && scope.row.totalPrice === 0">
                                <icon style="color: #67c23a; font-size: 30px" icon="check"></icon>
                            </span>
                            <span v-else>
                                <icon style="color: #f56c6c; font-size: 30px" icon="exclamation-circle"></icon>
                            </span>
                        </template>

                    </el-table-column>
            </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('debts', ['orders'])
    },
    methods: {
        editDates: function () {
            let fromDate = this.fromDate || '2018-01-01'
            let toDate = this.toDate || new Date()

            this.$store.dispatch('debts/getOrdersByClient', { fromDate: fromDate, toDate: toDate })
        }
    },
    data () {
        return {
            fromDate: '',
            toDate: new Date()
        }
    }
}
</script>
