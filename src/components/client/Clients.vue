<template>
    <div v-if="this.$store.state.admin.type === 'superadmin' || this.$store.state.admin.type === 'director'">
        <el-card>
            <el-row
                type="flex"
                justify="space-between"
                align="middle">
                    <h4>Վարձակալներ</h4>
                    <el-button
                        v-if="this.$store.state.admin.type === 'superadmin'"
                        type="primary"
                        plain
                        @click="$store.commit('clients/SHOW_CLIENT_DIALOG')">
                            Ավելացնել
                    </el-button>
            </el-row>

            <el-row>
                <div class="block">
                    <el-input
                        v-model="clientName"
                        placeholder="Վարձակալի անունը"/>
                </div>
            </el-row>
            <el-row>
                <div class="grid-content bg-purple">
                    <h1 class="">
                        <span>Օրվա ընդհանուր պարտք։ </span>
                        <span class="danger" v-html="$store.state.replacedPrice(getTotalPrice)"></span>
                    </h1>
                </div>
            </el-row>

            <el-table
                :data="clients"
                stripe
                border
                class="header-background">

                <el-table-column
                    sortable
                    label="ԱԱՀ"
                    prop="fullName"/>

                <el-table-column
                    sortable
                    label="Օրվա պարտք">
                    <template slot-scope="scope">
                        <span v-html="$store.state.replacedPrice(scope.row.price.dayPrice)"></span>
                    </template>
                </el-table-column>    

                <el-table-column
                    sortable
                    label="Տեսակ">
                    <template slot-scope="scope">
                        <div>
                            {{clientType[scope.row.type]}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    label="Սև ցուցակ">
                    <template slot-scope="scope">
                       <span v-if="scope.row.clientBlackList">
                           <icon
                                class="danger"
                                icon="exclamation-circle"/>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="Ջնջված"
                    prop="deleted">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deleted">
                            <icon class="danger" icon="trash-alt"/>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                    v-if="this.$store.state.admin.type === 'superadmin'"
                    label="Գործողություններ">
                    <template slot-scope="scope">
                        <el-button
                        type="warning"
                            size="mini"
                            @click="$store.dispatch('clients/edit', { data: scope.row, page: `?page=${$route.query.page}` })">
                                <icon icon="pencil-alt"/>
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="$store.dispatch('clients/remove', { id: scope.row._id })">
                                <icon icon="trash-alt"/>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <client/>
    </div>
</template>

<script>
    import Client from './Client'
    import { mapState, mapGetters } from 'vuex'

    export default {
        data () {
            return {
                clientName: ''
            }
        },
        watch: {
            'clientName': 'search'
        },
        methods: {
            search () {
                setTimeout(() => {
                    this.$store.dispatch('clients/search', {name: this.clientName, page: ''})
                }, 300)
            }
        },
        components: {
            Client
        },
        computed: {
            ...mapState('clients', ['clients', 'clientType']),
            ...mapGetters('clients', ['getTotalPrice'])
        },
        mounted () {
            this.$store.dispatch('clients/getAll')
        }
    }
</script>
<style lang="sass">
    .black-list-true
        color: #f56c6c
        font-size: 30px
        text-align: center
    .black-list-false
        color: #67c23a
        font-size: 30px
    .block
        margin-bottom: 20px
    .block inp</style>
