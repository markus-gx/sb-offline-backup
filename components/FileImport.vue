<template>
  <div class="file-import">
    <b-loading :is-full-page="true" :active.sync="loadingState.zip" :can-cancel="false" />
    <b-field class="file">
      <b-upload v-model="zipFile" accept=".zip">
        <a class="button is-primary">
          <b-icon icon="upload" />
          <span>Import .ZIP File</span>
        </a>
      </b-upload>
      <span v-if="zipFile" class="file-name">
        {{ zipFile.name }}
      </span>
    </b-field>
    <div>
      <b-button icon-left="import" type="is-primary" :disabled="zipFile === undefined" @click="startStoryImport">
        Start Import
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      zipFile: undefined,
      loadingState: {
        zip: false
      }
    }
  },
  computed: {
    stories () {
      return this.$store.state.storyblok.stories
    },
    totalStories () {
      return this.$store.state.storyblok.totalStories
    }
  },
  methods: {
    startStoryImport () {
      if (this.zipFile !== undefined) {
        this.loadingState.zip = true
        this.startZipFileImport()
      }
    },
    startZipFileImport () {
      alert('start file')
    },
    triggerReloadStories () {
      if (this.loadingState.zip === false && this.loadingState.jsons === false) {
        this.$emit('reloadStories')
      }
    }
  }
}
</script>

<style>

</style>
