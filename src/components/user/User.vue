<template>
  <div>
    <el-dialog
        title="Նոր Օգտատեր"
        :visible.sync="$store.state.users.dialogs.user"
        width="60%">
        <el-form label-position="top">
            <el-form-item
                    label="Կարգավիճակ">
                    <el-select
                        v-model="user.type"
                        placeholder="Ընտրեք">
                        <el-option
                            v-for="(item, key) in $store.state.users.userTypes"
                            :key="key"
                            :label="item"
                            :value="key"/>
                    </el-select>
                </el-form-item>
            <el-form-item label="Օգտատեր">
                <el-input
                    v-model="user.username"
                    placeholder="Օգտատեր"/>
            </el-form-item>
            <el-form-item label="Գաղտնաբառ">
                <el-input
                    v-model="user.password"
                    type="password"
                    placeholder="Գաղտնաբառ"/>
            </el-form-item>
            <el-row
                type="flex"
                justify="end"
                style="margin-top: 80px"
            >
              <el-button
                    @click="$store.commit('users/HIDE_USER_DIALOG')">
                    Չեղարկել
                </el-button>

                <el-button
                    v-if="user._id"
                    :loading="$store.state.buttonLoading"
                    @click="$store.dispatch('users/submit',true)"
                    type="primary">Պահպանել
                </el-button>
                <el-button
                    v-else
                    :loading="$store.state.buttonLoading"
                    @click="$store.dispatch('users/submit')"
                    type="primary">Ավելացնել
                </el-button>
            </el-row>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        data () {
            return {}
        },
        computed: {
            ...mapState('users', ['user'])
        }
    }
</script>
