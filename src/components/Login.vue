<template>
    <el-row
        type="flex"
        justify="center"
        style="padding-top: 100px">
        <el-col :span="8">
            <el-card>
                <div slot="header">
                    <h3>Մուտք</h3>
                </div>

                <el-form label-position="top">
                    <el-form-item label="Օգտատեր">
                        <el-input
                            v-model="$store.state.login.username"
                            placeholder="Օգտատեր"/>
                    </el-form-item>
                    <el-form-item label="Գաղտնաբառ">
                        <el-input
                            v-model="$store.state.login.password"
                            type="password"
                            placeholder="Գաղտնաբառ"/>
                    </el-form-item>
                    
                    <el-row
                        type="flex"
                        justify="end">
                        <el-button
                            type="primary"
                            style="margin-top: 20px"
                            @click.prevent="$store.dispatch('login')"
                            native-type="submit">
                            Մուտք գործել
                        </el-button>
                    </el-row>
                </el-form>
            </el-card>
        </el-col>
    </el-row>
</template>
