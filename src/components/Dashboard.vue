<template>
    <el-container id="dashboard">
        <el-aside width="64px">
            <div class="aside-container">
                <el-menu
                    :collapse="true"
                    :router="true">
                    <el-menu-item :route="{ name: 'home' }" index="11">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="home" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Գլխավոր</span>
                    </el-menu-item>

                    <el-menu-item
                        :route="{ name: 'products' }"
                        index="1"
                        v-if="admin.type !== 'secretary'">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="podcast" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Գույք</span>
                    </el-menu-item>

                  <el-menu-item
                    :route="{ name: 'damageds' }"
                    index="478"
                    v-if="admin.type !== 'secretary'">
                    <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                      <i>
                        <icon icon="podcast" style="font-size: 19px;"/>
                      </i>
                    </el-row>
                    <span slot="title">Վնասված Գույք</span>
                  </el-menu-item>

                    <!-- <el-menu-item :route="{ name: 'transactions' }" index="1-1">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="exchange-alt" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Գործարքներ</span>
                    </el-menu-item> -->

                    <el-menu-item
                        :route="{ name: 'orders' }"
                        index="1-5">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="shopping-cart" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Պատվերներ</span>
                    </el-menu-item>

                    <el-menu-item
                        :route="{ name: 'clients' }"
                        index="1-3"
                        v-if="admin.type === 'superadmin' || admin.type === 'director'">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="male" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Վարձակալներ</span>
                    </el-menu-item>

                    <el-menu-item
                        :route="{ name: 'debts' }"
                        index="1-15"
                        v-if="admin.type === 'superadmin' || admin.type === 'director'">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="list-ul" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Պարտքեր</span>
                    </el-menu-item>

                    <el-menu-item
                        :route="{ name: 'history' }"
                        index="1-17"
                        v-if="admin.type === 'superadmin' || admin.type === 'director'">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="history" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Պատմություն</span>
                    </el-menu-item>

                    <el-menu-item
                        :route="{ name: 'logs' }"
                        index="188"
                        v-if="this.admin.type === 'superadmin' || this.admin.type === 'director'">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="bell" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Logs</span>
                    </el-menu-item>



                    <!-- <el-menu-item :route="{ name: 'users' }" index="1-4">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="user" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Users</span>
                    </el-menu-item> -->

                    <el-menu-item
                        :route="{ name: 'contracts' }"
                        index="5"
                        v-if="admin.type === 'superadmin' || admin.type === 'director'">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="file" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Պայմանագրեր</span>
                    </el-menu-item>
                    <el-menu-item
                        :route="{ name: 'users' }"
                        index="1-9"
                        v-if="admin.type === 'superadmin' || admin.type === 'director'">
                        <el-row type="flex" justify="center" align="middle" style="height: 100%;">
                            <i>
                                <icon icon="users" style="font-size: 19px;"/>
                            </i>
                        </el-row>
                        <span slot="title">Օգտատերեր</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </el-aside>

        <el-container id="content">
            <el-header>
                <el-row
                    type="flex"
                    justify="space-between">
                    <h3>
                        <span style="margin-right:20px; color:blue;">
                            {{ admin.username }}
                        </span>
                        Accurate Group
                    </h3>
                    <el-button
                        style="margin-bottom: 8px"
                        type="text"
                        @click="$store.commit('LOGOUT')">
                        Դուրս գալ
                        <icon icon="sign-out-alt"/>
                    </el-button>
                </el-row>
            </el-header>

            <el-main>
                <transition name="slide" mode="out-in">
                    <router-view></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState(['admin'])
    }
}
</script>
