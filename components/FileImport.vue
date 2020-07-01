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
    <b-field>
      <b-checkbox v-model="overwriteExistingStories">
        Overwrite existing Stories
      </b-checkbox>
    </b-field>
    <b-notification :active="zipFile !== undefined" type="is-info" has-icon>
      Please note that currently only stories can be imported which have been downloaded from the same space as a "backup" and the components inside a story object should be already present and created in this space.
    </b-notification>
    <b-field>
      <b-button icon-left="import" type="is-primary" :disabled="zipFile === undefined" @click="startStoryImport">
        Start Import
      </b-button>
    </b-field>
    <b-notification :active="failedImports.length > 0" type="is-danger" has-icon>
      The following files / stories could not be imported:
      <ul>
        <li v-for="s in failedImports" :key="s.full_slug">
          {{ s.full_slug }}
        </li>
      </ul>
    </b-notification>
  </div>
</template>

<script>
import JSZip from 'jszip'

export default {
  data () {
    return {
      zipFile: undefined,
      overwriteExistingStories: false,
      loadingState: {
        zip: false
      }
    }
  },
  computed: {
    failedImports () {
      return this.$store.state.storyblok.failedImports
    },
    stories () {
      return this.$store.state.storyblok.stories
    },
    totalStories () {
      return this.$store.state.storyblok.totalStories
    }
  },
  methods: {
    storyExists (story) {
      return this.stories.some(s => s.full_slug === story.full_slug)
    },
    getExistingStoryId (story) {
      return this.stories.filter(s => s.full_slug === story.full_slug)[0].id
    },
    getParentIdForStory (story) {
      const parentSlug = story.full_slug.replace('/' + story.slug, '').replace(story.slug, '') // GEt Parent Slug by stories full slug replace /slug and slug
      if (parentSlug.length === 0) {
        // no parent
        return undefined
      } else {
        return this.stories.filter(s => s.full_slug === parentSlug)[0].id
      }
    },
    startStoryImport () {
      this.$store.commit('storyblok/clearFailedImports')
      if (this.zipFile !== undefined) {
        this.loadingState.zip = true
        this.startZipFileImport()
      }
    },
    startZipFileImport () {
      JSZip.loadAsync(this.zipFile).then((zip) => {
        const promises = []
        zip.forEach((relative, entry) => {
          if (!entry.dir) {
            promises.push(entry.async('binarystring'))
          }
        })
        Promise.all(promises).then((rawData) => {
          const stories = rawData.map(d => JSON.parse(d)).sort((a, b) => (a.is_folder === b.is_folder) ? ((a.full_slug.match(/\//g) || []).length > (b.full_slug.match(/\//g) || []).length ? 1 : -1) : a.is_folder ? -1 : 1) // Sort by is_folder thenBy count of '/'
          this.importStories(stories, () => {
            this.loadingState.zip = false
            this.$store.dispatch('storyblok/fetchStories', { page: 1, callback: () => {} })
            this.$buefy.toast.open({
              message: this.failedImports.length > 0 ? 'Not all stories have been imported' : 'Successfully imported all data',
              duration: 3000,
              type: this.failedImports.length > 0 ? 'is-warning' : 'is-success',
              position: 'is-bottom'
            })
          })
        })
      })
    },
    async importStories (stories, callback) {
      for (const story of stories) {
        story.parent_id = this.getParentIdForStory(story)
        if (this.storyExists(story)) {
          if (!story.is_folder && this.overwriteExistingStories) {
            story.id = this.getExistingStoryId(story)
            await this.$store.dispatch('storyblok/updateStory', {
              story
            })
          }
        } else {
          await this.$store.dispatch('storyblok/createStory', {
            story
          })
        }
      }
      callback()
    }
  }
}
</script>

<style>
ul{
  list-style: disc;
}
</style>
