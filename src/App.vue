<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
    mounted () {
        if (localStorage.getItem('token') !== null) {
            this.$store.dispatch('users/me')
        }
    }
}
</script>

<style src="./styles/app.sass" lang="sass"></style>
