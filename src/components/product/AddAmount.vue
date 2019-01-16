<template>
  <div>
      <el-dialog
        :title="translateType"
        width="30%"
        :visible.sync="$store.state.products.dialogs.addAmount">
    {{product.used}}
        <el-form>
            <el-form-item label="Տեսակ">
                <el-radio v-model="product.used" :label="true">Օգտագործված</el-radio>
                <el-radio v-model="product.used" :label="false">Նոր</el-radio>
            </el-form-item>
            
            <h1>
                <el-form-item 
                    style="color: red" 
                    label="Առկա քանակ">
                    {{$store.state.products.product.availableAmount}}
                </el-form-item>
            </h1>

            <!-- <el-form-item label="Առկա քանակ Հին">
                {{$store.state.products.product}}
            </el-form-item> -->

            <el-form-item label="Գույքի քանակ">
                <el-input-number
                    v-model="product.addedAmount"
                    placeholder="ավելացված քանակ"
                    :controls="false"
                    type="number"/>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button
                @click="$store.state.products.dialogs.addAmount = false">
                Չեղարկել
            </el-button>
            <el-button
                type="primary"
                :loading="$store.state.buttonLoading"
                @click="$store.dispatch('products/changeAmount')">
                Պահպանել
            </el-button>

        </span>

    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState('products', ['product', 'productAmount', 'translateType'])
    },
    data () {
        return {}
    },
    watch: {
        'product.used': 'onChangeUsed'
    },
    methods: {
        onChangeUsed () {
            this.$store.commit('products/ADD_AMOUNT', {product: this.productAmount, add: this.$store.state.products.product.add})
        }
    }
}
</script>
