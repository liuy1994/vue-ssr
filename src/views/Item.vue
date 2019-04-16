<template>
    <ul>
        <li v-for="item in items" :key="item">{{item}}</li>
    </ul>
</template>

<script>
    export default {
        name: "Item",
        asyncData({store}) {
            return store.dispatch('fetchItem')
        },
        computed: {
            items() {
                return this.$store.state.items
            }
        }
    }
</script>
