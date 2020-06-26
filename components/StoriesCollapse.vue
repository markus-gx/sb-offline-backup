<template>
  <b-collapse animation="slide" :open.sync="storiesOpen">
    <div
      slot="trigger"
      slot-scope="props"
      class="card-header"
      role="button"
    >
      <p class="card-header-title">
        Stories
      </p>
      <a class="card-header-icon">
        <b-icon
          :icon="props.open ? 'menu-down' : 'menu-up'"
        />
      </a>
    </div>
    <div class="card-content">
      <div class="content">
        <div class="columns is-multiline is-mobile is-vcentered is-centered">
          <StoryMeta v-for="s in stories" :key="s._uid" class="column is-one-third" :story="s" />
        </div>
      </div>
    </div>
  </b-collapse>
</template>

<script>
import StoryMeta from '~/components/StoryMeta.vue'

export default {
  components: {
    StoryMeta
  },
  data () {
    return {
      storiesOpen: false
    }
  },
  computed: {
    stories () {
      return this.$store.state.storyblok.stories
    }
  }
}
</script>

<style>

</style>
