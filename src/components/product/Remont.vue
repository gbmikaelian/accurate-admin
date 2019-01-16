  <template>
    <el-dialog
      width="50%"
      title="Նոր գույք"
      :visible.sync="$store.state.transactions.dialogs.transaction">
      <el-form label-position="top">
        <el-form-item label="Անվանում">

          <el-input
            v-model="single.remontedAmount"
            placeholder="Անվանում"/>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button
              @click="$store.state.transactions.dialogs.transaction = false">
                Չեղարկել
            </el-button>
            <el-button
              type="primary"
              :loading="$store.state.buttonLoading"
              @click="remontProduct">
                Պահպանել
            </el-button>
        </span>
    </el-dialog>
  </template>

  <script>
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState('transactions', ['single'])
        },
        methods: {
            remontProduct: async function () {
                await this.$store.dispatch('transactions/remont')

                await this.$store.dispatch('products/getAllDamaged')
            }
        }
    }
  </script>



