<template>
    <el-dialog
        width="50%"
        title="Նոր գույք"
        :visible.sync="$store.state.products.dialogs.product">
        <el-form label-position="top">
            <el-form-item label="Անվանում">
                <el-input
                    v-model="product.name"
                    placeholder="Անվանում"/>
            </el-form-item>

            <el-form-item label="Նոր գույքի վաճառքի գին">
                <el-input
                    v-model="product.newSoldPrice"
                    placeholder="Price"
                    :controls="false"/>
            </el-form-item>

            <el-form-item label="Հին գույքի վաճառքի գին">
                <el-input
                    v-model="product.oldSoldPrice"
                    placeholder="Price"
                    :controls="false"/>
            </el-form-item>

            <el-form-item label="Նոր գույքի վարձույթի գին">
                <el-input
                    v-model="product.newRentedPrice"
                    placeholder="Price"
                    :controls="false"/>
            </el-form-item>

            <el-form-item label="Հին գույքի վարձույթի գին">
                <el-input
                    v-model="product.oldRentedPrice"
                    placeholder="Price"
                    :controls="false"/>
            </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button
                @click="$store.state.products.dialogs.product = false">
                Չեղարկել
            </el-button>
            <el-button
                type="primary"
                v-if="product._id"
                :loading="$store.state.buttonLoading"
                @click="$store.dispatch('products/submit', true)">
                Պահպանել
            </el-button>

            <el-button
            type="primary"
            :loading="$store.state.buttonLoading"
            v-else
            @click="$store.dispatch('products/submit', null)">
                Ավելացնել
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState('products', ['product'])
        },
        data () {
            return {}
        }
    }
</script>
