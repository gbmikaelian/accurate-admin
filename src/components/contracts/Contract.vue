<template>
    <el-dialog
        title="Պայմանագիր"
        :visible.sync="$store.state.contracts.dialogs.contract"
        width="60%">
        <el-form label-position="top">
            <el-form-item label="Անվանում">
                <el-input
                    v-model="contract.name"
                    placeholder="Անվանում"/>
            </el-form-item>
            <el-form-item label="Բովանդակություն">
                <quill-editor
                        ref="contractContent"
                        v-model="contract.content"
                        :options="quillOptions"
                        style="height: 600px">
                    </quill-editor>
            </el-form-item>
            <el-row
                type="flex"
                justify="end"
                style="margin-top: 80px">
                <el-button
                    v-if="contract._id"
                    :loading="$store.state.buttonLoading"
                    @click="$store.dispatch('contracts/submit', { update: true })"
                    type="primary">Պահպանել</el-button>
                <el-button
                    v-else
                    :loading="$store.state.buttonLoading"
                    @click="$store.dispatch('contracts/submit')"
                    type="primary">Ավելացնել</el-button>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState('contracts', [
                'contract',
                'loaders'
            ])
        },
        data () {
            return {
                quillOptions: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            ['clean']
                        ]
                    }
                }
            }
        }
    }
</script>
