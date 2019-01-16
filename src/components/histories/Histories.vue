<template>
    <div v-if="this.$store.state.admin.type === 'superadmin' || this.$store.state.admin.type === 'director'">
        <el-card v-loading="loaders.all">
            <div>
                <template>
                    <p>
                        <span>Փնտրել</span>
                    </p>
                    <div class="block">
                        <span class="demonstration">
                            Սկսած&nbsp;
                        </span>
                        <el-date-picker
                            type="date"
                            v-model="search.fromDate"
                            placeholder="Ընտրեք օրը և ժամը"/>
                    </div>
                    <div class="block">
                        <span class="demonstration">
                            Մինչև&nbsp;
                        </span>
                        <el-date-picker
                            type="date"
                            v-model="search.toDate"
                            placeholder="Ընտրեք օրը և ժամը"/>
                    </div>
                    <div class="block">
                        <el-input
                            v-model="search.byClient"
                            placeholder="Ըստ Հաճախորդի"/>
                    </div>
                </template>
            </div>
            <el-table
                border
                stripe
                :data="histories"
                class="header-background">
                <el-table-column
                    label="Վարձակալ"
                    prop="clientName"/>

                <el-table-column
                    label="Վճարած գումար"
                    prop="paid">
                  <template slot-scope="scope">
                    <span v-html="$store.state.replacedPrice(scope.row.paid)"></span>
                  </template>
                </el-table-column>

                <el-table-column
                    label="Վճարած Օր">
                    <template slot-scope="scope">
                        <span v-html="$store.state.reformatDate(scope.row.createdAt)"></span>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState('histories', [
                'histories',
                'loaders'
            ])
        },
        data () {
            return {
                search: {
                    toDate: new Date(),
                    fromDate: '',
                    byClient: ''
                }
            }
        },
        mounted () {
            this.$store.dispatch('histories/getAll')
        },
        watch: {
            'search.toDate': 'searchHistory',
            'search.fromDate': 'searchHistory',
            'search.byClient': 'searchHistory'
        },
        methods: {
            searchHistory () {
                setTimeout(() => {
                    this.$store.dispatch('histories/search', this.search)
                }, 300)
            },
            price (price) {
                return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} &#1423;`
            }
        }
    }
</script>
<style lang="sass">
    .block
        float: left
        margin: 0 15px 25px 0
</style>
