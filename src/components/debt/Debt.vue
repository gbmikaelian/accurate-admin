<template>
    <div>
        <el-dialog
            title="Պարտք"
            width="50%"
            :visible.sync="$store.state.debts.dialogs.debt">
                <el-form>
                    <h1>
                        <el-form-item
                            style="color: red"
                            label="Ընդհանուր պարտք"
                            :label-width="formLabelWidth">
                            {{$store.state.debts.totalDebt}}
                        </el-form-item>
                    </h1>
                    <el-form-item
                        label="Գինը"
                        :label-width="formLabelWidth">
                        <el-input placeholder="Ներմուծեք գումար" v-model="debt.paid"/>
                    </el-form-item>

                    <el-form-item
                        label="Ամսաթիվ"
                        :label-width="formLabelWidth">
                        <el-date-picker
                            v-model="debt.createdAt"
                            type="date"
                            placeholder="Ընտրեք տարեթիվը և ժամը">
                        </el-date-picker>
                    </el-form-item>

                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button
                        @click="$store.state.debts.dialogs.debt = false">
                        Չեղարկել
                    </el-button>

                    <el-button
                        type="primary"
                        :loading="$store.state.buttonLoading"
                        @click="repayment">
                        Պահպանել
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
            formLabelWidth: '250px'
        }
    },
    computed: {
        ...mapState('debts', ['debt'])
    },
    methods: {
        repayment: async function () {
            await this.$store.dispatch('debts/submit')

            if (this.$store.state.home.clientId) {
                await this.$store.dispatch('home/getAllHistoriesByClient', { type: 'current', fromDate: '', toDate: '' })
            }
        }
    }

}
</script>
