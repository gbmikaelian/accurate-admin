<template>
  <div>
    <el-card>
      <el-row
        type="flex"
        justify="space-between"
        align="middle">
        <h4>Վնասված Գույք</h4>
      </el-row>
      <!--<div>-->
        <!--<template>-->
          <!--<p>-->
            <!--<span>Փնտրել</span>-->
          <!--</p>-->
          <!--<div class="block">-->
            <!--<span class="demonstration">Սկիզբ&nbsp;</span>-->
            <!--<el-date-picker-->
              <!--type="date"-->
              <!--v-model="fromDate"-->
              <!--@change="search"-->
              <!--placeholder="Ընտրեք օրը"/>-->
          <!--</div>-->
          <!--<div class="block">-->
            <!--<span class="demonstration">Մինչև&nbsp;</span>-->
            <!--<el-date-picker-->
              <!--type="date"-->
              <!--v-model="toDate"-->
              <!--@change="search"-->
              <!--placeholder="Ընտրեք օրը"/>-->
          <!--</div>-->
          <!--<div class="block">-->
            <!--<el-input-->
              <!--v-model="orderNumber"-->
              <!--placeholder="Պատվերի համարը"/>-->
          <!--</div>-->
          <!--<div class="block">-->
            <!--<el-input-->
              <!--v-model="clientName"-->
              <!--placeholder="Հաճախորդի անունը"/>-->
          <!--</div>-->
          <!--<div class="block">-->
            <!--<el-input-->
              <!--v-model="productName"-->
              <!--placeholder="Գույք"/>-->
          <!--</div>-->
        <!--</template>-->
      <!--</div>-->
      <el-table
        :data="damageds"
        stripe
        border
        style="width: 100%"
        class="header-background">
        <el-table-column
          label="Գույք"
          prop="info.name" />

        <el-table-column
          label="Վնասված"
          prop="totalDamaged" />

        <el-table-column
          label="Գործողություններ"
          :width="500">
          <template slot-scope="scope">

            <el-button
              size="mini"
              type="warning"
              @click="$store.commit('transactions/remont', scope.row)"
              class="orderButton">
              <icon icon="pencil-alt"/>
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <remont/>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Remont from './Remont'
  export default {
      components: {
          Remont
      },
      computed: {
          ...mapState('products', ['damageds'])
      },
      mounted () {
          this.$store.dispatch('products/getAllDamaged')
      }
  }
</script>
