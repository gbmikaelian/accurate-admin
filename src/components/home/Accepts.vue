<template>
    <div>
        <el-dialog
            title="Գույքի ընդունում"
            width="90%"
            :visible.sync="$store.state.home.dialogs.accepts">
            <el-table
                :data="accepts"
                stripe
                border
                style="width: 100%"
                class="header-background">

                <el-table-column
                    label="Գույք">
                    <template slot-scope="scope">
                      {{ scope.row.product.name }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="Օր">
                    <template slot-scope="scope">
                        {{ scope.row.info.acceptAt | formatedDate }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="Սարքին"
                    prop="info.normal"/>

                <el-table-column
                    label="Ջարդված/կորուստ"
                    prop="info.lost"/>

                <el-table-column
                    label="Վնասված"
                    prop="info.damaged"/>


            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'

    export default {
        computed: {
            ...mapState('home', [
                'accepts'
            ])
        },
        filters: {
            formatedDate: function (value) {
                return moment.utc(value).format('DD/MM/YYYY')
            }
        }
    }
</script>
