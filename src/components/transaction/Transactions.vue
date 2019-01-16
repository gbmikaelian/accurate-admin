<template>
    <div>
        <el-row
                type="flex"
                justify="space-between"
                align="middle">
                <h4>Գործարքներ</h4>
            </el-row>
        <el-table
            :data="transactions"
            stripe
            border
            style="width: 100%">

            <el-table-column
            label="Վաճառված"
            prop="soldAmount"
            width="180"/>

            <el-table-column
            label="Վարձակալված"
            prop="rentedAmount"
            width="180"/>

            <el-table-column
            label="Ընդհանուր քանակ"
            prop="addedAmount"
            width="180"/>

            <el-table-column
            label="Օգտագործված"
            prop="useducts"
            width="180"/>

            <el-table-column
            label="acceptedAmount"
            prop="acceptedAmount"
            width="180"/>

            <el-table-column
            label="Ստեղծվել է"
            prop="createdAt"
            width="200"/>
        </el-table>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState('transactions', ['transactions'])
        },
        mounted () {
            this.$store.dispatch('transactions/getAll')
        }
    }
</script>
