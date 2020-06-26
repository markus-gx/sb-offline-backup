<template>
  <div class="columns">
    <div class="column">
      <h1 class="title">
        Available Stories: {{ totalStories }}
      </h1>
      <h2 class="subtitle">
        Fetched: {{ stories.length }}
      </h2>
    </div>
    <FileImport class="column" />
  </div>
</template>

<script>
import FileImport from '~/components/FileImport.vue'
export default {
  components: {
    FileImport
  },
  computed: {
    stories () {
      return this.$store.state.storyblok.stories
    },
    totalStories () {
      return this.$store.state.storyblok.totalStories
    }
  }
}
</script>

<style>

</style>
