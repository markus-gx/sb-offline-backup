<template>
  <div class="story-meta-container card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <b-icon :icon="story.is_folder ? 'folder' : 'post'" />
        </div>
        <div class="media-content">
          <p class="title is-5">
            {{ story.name }}
          </p>
          <p class="title is-7">
            {{ story.full_slug }}
          </p>
        </div>
      </div>

      <div class="content has-text-right">
        <time>{{ getFormattedDate }}</time>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['story'],
  computed: {
    getFormattedDate () {
      const date = new Date(this.story.updated_at)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }
  }
}
</script>

<style lang="scss">
</style>
