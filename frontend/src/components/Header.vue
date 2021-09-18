<template>
    <header>
        <div class="navbar"
            v-for="nav in navigations" :key="nav.name">
            <RouterLink class="nav" :to="nav.href">
                {{ nav.name }}
            </RouterLink>
        </div>
    </header>
</template>

<script>

export default ({
    data() {
        return {
            navigations: [
                {
                    name: 'Login',
                    href: '/login'
                },
                {
                    name: 'Join',
                    href: '/join'
                }
            ]
        }
    }
})
</script>

<style scoped>
 header {
     display: flex;
     justify-content: flex-end;
     margin-right: 10px;
    }
.nav {
    text-decoration: none;
    margin: 0 10px;
    color:gray;
}
</style>