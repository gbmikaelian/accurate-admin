<template>
    <div>
        <el-dialog
            title="Գույքի ընդունում"
            :visible.sync="$store.state.orders.dialogs.accept">
            <el-form label-position="top">
                <!-- <div class="block"> -->
                    <!-- <div class="demonstration">Հաստատել օրը</div> 
                </div> -->
                <el-form-item label="Հաստատել օրը">
                    <el-date-picker
                        v-model="accept.acceptAt"
                        type="date"
                        placeholder="Ընտրեք օրը">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="Սարքին">
                    <el-input-number
                        v-model="accept.normal"
                        placeholder="Normal"
                        :controls="false"/>
                </el-form-item>

                <el-form-item label="Ջարդված/կորուստ">
                    <el-input-number
                        v-model="accept.lost"
                        placeholder="Lost"
                        :controls="false"/>

                </el-form-item>
                <el-form-item label="Վնասված">
                    <el-input-number
                        v-model="accept.damaged"
                        placeholder="Damaged"
                        :controls="false"/>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="$store.state.orders.dialogs.accept = false">
                    Չեղարկել
                </el-button>
                <el-button
                    type="primary"
                    :loading="$store.state.buttonLoading"
                    @click="$store.dispatch('orders/accept')">
                    Հաստատել
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    computed: {
        ...mapState('orders', ['accept'])
    },
    data () {
        return {date: new Date()}
    }
}
</script>