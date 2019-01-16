<template>
    <div v-if="this.$store.state.admin.type === 'superadmin' || this.$store.state.admin.type === 'director'">
        <el-card v-loading="loaders.all">
            <div slot="header">
                <el-row
                    type="flex"
                    justify="space-between"
                    align="middle">
                     <h4>
                        Պայմանագրեր
                    </h4>
                    <el-button
                        v-if="this.$store.state.admin.type === 'superadmin'"
                        icon="el-icon-plus"
                        type="primary"
                        @click="$store.commit('contracts/ADD')">
                        Ավելացնել
                    </el-button>
                </el-row>
            </div>
            <el-table 
                :data="contracts" 
                stripe 
                border 
                class="header-background">
                <el-table-column label="Անվանում" prop="name"/>
                <el-table-column
                    v-if="$store.state.admin.type === 'superadmin' || $store.state.admin.type === 'director'"
                    label="Գործողություններ"
                    :width="200">
                    <template slot-scope="scope">
                        <el-button
                            type="success"
                            size="mini"
                            @click="$store.commit('contracts/VIEW', scope.row)">
                            <icon icon="search-plus"/>
                        </el-button>
                        <el-button
                            v-if="$store.state.admin.type === 'superadmin'"
                            type="warning"
                            size="mini"
                            @click="$store.commit('contracts/EDIT', scope.row)">
                            <icon icon="pencil-alt"/>
                        </el-button>
                        <el-button
                            v-if="$store.state.admin.type === 'superadmin'"
                            type="danger"
                            size="mini"
                            @click="$store.dispatch('contracts/remove', scope.row._id)">
                            <icon icon="trash-alt"/>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <contract/>
        <view-contract/>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Contract from './Contract'
    import ViewContract from './ViewContract'

    export default {
        components: {
            Contract,
            ViewContract
        },
        computed: {
            ...mapState('contracts', [
                'contracts',
                'loaders'
            ])
        },
        mounted () {
            this.$store.dispatch('contracts/getAll')
        }
    }
</script>
