<template>
    <el-dialog
        title="Պայմանագիրd"
        :visible.sync="$store.state.contracts.dialogs.viewContract"
        width="60%">
        <el-row>
            <h1>
                {{contract.name}}
            </h1>
        </el-row>
        <el-row>
            <div
            v-html="contract.content">
            </div>
        </el-row>
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
