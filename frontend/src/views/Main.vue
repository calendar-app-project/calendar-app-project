<template>
   <div class="container">
        <div>
            <h1>Main 페이지</h1>
            <div>
                {{ userId }}
            </div>
        </div>
   </div>
</template>

<script>

export default ({
    computed: {
        userId() {
            return this.$store.state.user.userId;
        }
    },
})
</script>
