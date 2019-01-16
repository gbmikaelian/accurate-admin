<template>
  <div v-if="this.$store.state.admin.type === 'superadmin' || this.$store.state.admin.type === 'director'">
      <el-card>
            <div slot="header">
                <el-row
                    type="flex"
                    justify="space-between"
                    align="middle">
                    <h4>
                        Օգտատերեր
                    </h4>
                    <el-button
                        v-if="this.$store.state.admin.type === 'superadmin'"
                        icon="el-icon-plus"
                        type="primary"
                        @click="$store.commit('users/ADD')">
                        Ավելացնել
                    </el-button>
                </el-row>
            </div>
            <el-table :data="all" stripe border class="header-background">
                <el-table-column label="Օգտատեր" prop="username"/>
                <el-table-column
                    v-if="this.$store.state.admin.type === 'superadmin'"
                    label="Գործողություններ"
                    :width="200">
                    <template slot-scope="scope">
                        <el-button
                            type="warning"
                            size="mini"
                            @click="$store.commit('users/EDIT', scope.row)">
                            <icon icon="pencil-alt" />
                        </el-button>
                        <el-button
                            type="danger"
                            size="mini"
                            @click="$store.dispatch('users/remove', scope.row._id)">
                            <icon icon="trash-alt" />
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
      </el-card>
      <user/>
  </div>
</template>
<script>
    import { mapState } from 'vuex'
    import User from './User'
    export default {
        components: {
            User
        },
        computed: {
            ...mapState('users', ['all'])
        },
        mounted () {
            this.$store.dispatch('users/getAll')
        }
    }
</script>

<style>

</style>

