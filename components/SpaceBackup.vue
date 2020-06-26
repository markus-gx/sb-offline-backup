<template>
  <div>
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
      :loading="storiesForDownload.length != totalStories || download.started"
      :disabled="selection === undefined"
      size="is-medium"
      expanded
      @click="startBackup"
    >
      Back-Up Now
    </b-button>
    <b-progress
      v-if="download.started"
      class="m-5"
      type="is-primary"
      :max="storiesForDownload.length"
      :value="download.idx"
      show-value
      size="is-large"
    >
      Backing Up Story {{ download.idx }} / {{ storiesForDownload.length }}
    </b-progress>
  </div>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default {
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
      download: {
        started: false,
        idx: 0
      }
    }
  },
  computed: {
    storiesForDownload () {
      return this.$store.state.storyblok.stories
    },
    totalStories () {
      return this.$store.state.storyblok.totalStories
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
      for (let i = 0; i < this.storiesForDownload.length; i++) {
        const data = await this.fetchStory(this.storiesForDownload[i].id)
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
    }
  }
}
</script>

<style>

</style>
