<template>
    <div
        v-if="this.$store.state.admin.type === 'superadmin' || this.$store.state.admin.type === 'director'">
        <el-card v-loading="loaders.all">
            <el-table border="border" stripe="stripe" :data="logs" class="header-background">
                <el-table-column
                    align="center"
                    label="Ադմին"
                    prop="user.type">
                    <template slot-scope="scope">
                        <div>
                            <h2>{{scope.row.user.username}}</h2>
                            <p>{{$store.state.users.userTypes[scope.row.user.type]}}</p>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    align="center"
                    label="Կատեգորիա">
                    <template slot-scope="scope">
                        {{$store.state.logs.categoryLang[scope.row.key]}}
                    </template>
                </el-table-column>

                <el-table-column
                    width="700"
                    label="Գործողություն">

                    <template slot-scope="scope">
                        <div v-if="scope.row.key === 'product'">
                            <div v-if="scope.row.status === 'added'">
                                <ul>
                                    <li><span class="keys">Անվանում:</span> {{scope.row.value.name}}</li>
                                </ul>    
                            </div>
                            <div v-else>
                                <ul>
                                    <li><span class="keys">Անվանում:</span> {{scope.row.value.name}}</li>
                                    <li v-if="scope.row.value.transaction"><span class="keys">Քանակ:</span> {{scope.row.value.transaction.addedAmount}}</li>
                                    <li><span class="keys">Վիճակ:</span>
                                        <span v-if="scope.row.value.used">
                                            Օգտագործած
                                        </span>
                                        <span v-else>
                                            Նոր
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                        <div v-else-if="scope.row.key === 'order'">
                            <ul>
                                <li><span class="keys">Համար:</span> {{scope.row.value.number}}</li>
                            </ul>
                        </div>
                        <div v-else-if="scope.row.key === 'user'">
                            <ul>
                                <li><span class="keys">Անուն:</span> {{scope.row.value.username}}</li>
                                <li><span class="keys">Կարգավիճակ:</span> {{scope.row.value.type}}</li>
                            </ul>
                        </div>
                        <div v-else-if="scope.row.key === 'client'">
                             <ul>
                                <li><span class="keys">Անուն:</span> {{scope.row.value.fullName}}</li>
                            </ul>
                        </div>
                        <div class="w-100" v-else-if="scope.row.key === 'debt'">
                            <ul>
                                <li><span class="keys">Անուն:</span> {{scope.row.value.clientName}}</li>
                                <li><span class="keys">Վճարում:</span> {{scope.row.value.paid}}</li>
                            </ul>
                        </div>
                        <div v-else-if="scope.row.key === 'accept'">
                                <ul>
                                    <li><span class="keys">Ապրանք:</span> {{scope.row.value.name}}</li>
                                    <li><span class="keys">Սարքին:</span> {{scope.row.value.accept.normal}}</li>
                                    <li><span class="keys">Ջարդված:</span> {{scope.row.value.accept.damaged}}</li>
                                    <li><span class="keys">Վնասված:</span> {{scope.row.value.accept.lost}}</li>
                                </ul>  
                        </div>
                        <div v-else-if="scope.row.key === 'contract'">
                            <ul>
                                <li><span class="keys">Անուն:</span> {{scope.row.value.name}}</li>
                            </ul>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    align="center"
                    label="Վիճակ">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status === 'added'">
                            <div> Ավելացում </div>
                            <icon class="success" icon="plus"/>
                        </div>
                        <div v-if="scope.row.status === 'return'">
                            <div> Գույքի ընդունում </div>
                            <icon class="success" icon="plus"/>
                        </div>
                        <div v-if="scope.row.status === 'addedAmount'">
                            <div> Քանակի ավելացում </div>
                            <icon class="success" icon="plus"/>
                        </div>
                        <div v-if="scope.row.status === 'subAmount'">
                            <div> Քանակի նվազեցում </div>
                            <icon class="warning" icon="minus"/>
                        </div>
                        <div v-if="scope.row.status === 'updated'">
                            <div> Փոփոխում </div>                            
                            <icon class="warning" icon="pencil-alt"/>
                        </div>
                        <div v-if="scope.row.status === 'confirmed'">
                            <div> Պատվերի հաստատում </div>
                            <icon class="success" icon="check"/>
                        </div>
                        <div v-if="scope.row.status === 'deleted'">
                            <div> Ջնջում </div>                            
                            <icon class="danger" icon="trash-alt"/>
                        </div>
                        <div v-if="scope.row.status === 'paid'">
                            <div> Պարտքի վճարում </div>                            
                            <icon class="success" icon="money-bill-alt"/>
                        </div>

                    </template>
                </el-table-column>

                <el-table-column
                    align="center"
                    label="Ամսաթիվ">
                    <template slot-scope="scope">
                        <span v-html="$store.state.reformatDate(scope.row.createdAt)"></span>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    computed: {
        ...mapState('logs', ['logs', 'loaders'])
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
        this
            .$store
            .dispatch('logs/getAll')
    }
}
</script>
<style>
    ul {
        list-style-type: none;
    }
    .keys {
        color: black;
        font-weight: 700;
    }
    .w-100 {
        width: 100%
    }
</style>