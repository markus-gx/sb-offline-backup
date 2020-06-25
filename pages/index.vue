<template>
  <div class="hero hero-body">
    <h1 class="title">
      Available Stories: {{ totalStories }}
    </h1>
    <h2 class="subtitle">
      Fetched: {{ stories.length }}
    </h2>
    <hr>
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
    <hr>
    <b-field label="Backup Options">
      <b-select v-model="selection" expanded>
        <optgroup v-for="options in getOptionsGrouped" :key="options[0]" :label="options[0]">
          <option v-for="val in options[1]" :key="val.value" :value="val.value">
            {{ val.description }}
          </option>
        </optgroup>
      </b-select>
    </b-field>
    <b-button
      type="is-primary"
      icon-left="backup-restore"
      :loading="stories.length != totalStories || download.started"
      :disabled="selection === undefined"
      size="is-medium"
      @click="startBackup"
    >
      Back-Up Now
    </b-button>
    <b-progress
      v-if="download.started"
      class="m-5"
      type="is-primary"
      :max="getStoriesForDownload.length"
      :value="download.idx"
      show-value
      size="is-large"
    >
      Backing Up Story {{ download.idx }} / {{ getStoriesForDownload.length }}
    </b-progress>
  </div>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import StoryMeta from '~/components/StoryMeta.vue'

export default {
  components: {
    StoryMeta
  },
  data () {
    return {
      backupOptions: [
        {
          group: 'Offline Download',
          value: 'zip',
          description: 'ZIP archive (JSON Files)'
        },
        {
          group: 'Offline Download',
          value: 'zipPretty',
          description: 'ZIP archive (JSON Files Pretty Printed)'
        }
      ],
      selection: undefined,
      totalStories: 0,
      stories: [],
      storiesOpen: false,
      globalLoading: undefined,
      download: {
        started: false,
        idx: 0
      }
    }
  },
  computed: {
    getStoriesForDownload () {
      return this.stories
    },
    getOptionsGrouped () {
      const map = new Map()
      this.backupOptions.forEach((item) => {
        const key = item.group
        const collection = map.get(key)
        if (!collection) {
          map.set(key, [item])
        } else {
          collection.push(item)
        }
      })
      return map
    }
  },
  mounted () {
    if (window.top === window.self) {
      window.location.assign('https://app.storyblok.com/oauth/app_redirect')
    } else {
      this.loadStories()
    }
  },
  methods: {
    resetDownloadStatistics () {
      this.download.started = false
      this.download.idx = 0
    },
    startBackup () {
      this.resetDownloadStatistics()
      switch (this.selection) {
        case 'zip': {
          this.downloadZipArchive(false)
          break
        }
        case 'zipPretty': {
          this.downloadZipArchive(true)
          break
        }
        default: {
          this.$buefy.toast.open({
            message: 'Download option not available',
            duration: 3000,
            position: 'is-bottom',
            type: 'is-danger'
          })
        }
      }
    },
    async downloadZipArchive (prettyPrint) {
      this.download.started = true
      const zip = new JSZip()
      for (let i = 0; i < this.getStoriesForDownload; i++) {
        const data = await this.fetchStory(this.getStoriesForDownload[i].id)
        const jsonData = prettyPrint ? JSON.stringify(data, null, 2) : JSON.stringify(data)
        zip.file(data.full_slug + '.json', jsonData)
        this.download.idx++
      }
      zip.generateAsync({ type: 'blob' })
        .then(function (blob) {
          saveAs(blob, 'SB-Backup-' + new Date().toLocaleDateString() + '.zip')
        })
      this.resetDownloadStatistics()
    },
    async fetchStory (id) {
      const { data } = await axios.get(`/auth/spaces/${this.$route.query.space_id}/stories/${id}`)
      return data.story
    },
    loadStories () {
      this.globalLoading = this.$buefy.loading.open({ container: null })
      this.fetchStoriesForPage(1)
    },
    fetchStoriesForPage (page) {
      axios.get(`/auth/spaces/${this.$route.query.space_id}/stories?story_only=true&page=` + page)
        .then((res) => {
          if (this.stories.length === 0) {
            this.stories = res.data.stories
          } else {
            this.stories = this.stories.concat(res.data.stories)
          }
          this.totalStories = res.data.total
          if (this.totalStories !== this.stories.length && res.data.stories.length > 0) {
            this.fetchStoriesForPage(page + 1)
          } else {
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
