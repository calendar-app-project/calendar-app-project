<template>
   <div class="container">
        <div>
            <h1>Main 페이지</h1>
            <div>
                {{ userName }}
            </div>
        </div>
   </div>
</template>

<script>

export default ({
    computed: {
        userName() {
            return this.$store.state.user.userId;
        }
    },
})
</script>
