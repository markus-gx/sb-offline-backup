<template>
  <div class="hero hero-body">
    <SpaceInformation @reloadStories="loadStories" />
    <hr>
    <StoriesCollapse />
    <hr>
    <SpaceBackup />
  </div>
</template>

<script>
import SpaceInformation from '~/components/SpaceInformation.vue'
import StoriesCollapse from '~/components/StoriesCollapse.vue'
import SpaceBackup from '~/components/SpaceBackup.vue'

export default {
  components: {
    SpaceInformation,
    StoriesCollapse,
    SpaceBackup
  },
  data () {
    return {
      globalLoading: undefined
    }
  },
  computed: {
    getStoriesForDownload () {
      return this.stories
    }
  },
  mounted () {
    if (window.top === window.self) {
      window.location.assign('https://app.storyblok.com/oauth/app_redirect')
    } else {
      this.$store.commit('storyblok/setSpaceId', this.$route.query.space_id)
      this.loadStories()
    }
  },
  methods: {
    loadStories () {
      this.globalLoading = this.$buefy.loading.open({ container: null })
      this.$store.dispatch('storyblok/fetchStories', {
        page: 1,
        callback: () => {
          this.globalLoading.close()
        }
      })
    }
  }
}
</script>

<style>
.m-5{
  margin: 5px;
}
</style>
