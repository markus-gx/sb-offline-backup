import axios from 'axios'

export const state = () => ({
  stories: [],
  totalStories: 0,
  spaceId: undefined,
  failedImports: []
})

export const mutations = {
  setStories (state, stories) {
    state.stories = stories
  },
  addStory (state, story) {
    state.stories.push(story)
  },
  updateStory (state, story) {
    const idx = state.stories.find(s => s.full_slug === story.full_slug)
    if (idx !== undefined) {
      state.stories[idx] = story
    }
  },
  concatStories (state, stories) {
    state.stories = state.stories.concat(stories)
  },
  setTotalStories (state, total) {
    state.totalStories = total
  },
  setSpaceId (state, spaceId) {
    state.spaceId = spaceId
  },
  clearStories (state) {
    state.stories = []
  },
  clearFailedImports (state) {
    state.failedImports = []
  },
  addFailedImport (state, story) {
    state.failedImports.push(story)
  }
}

export const actions = {
  fetchStories ({ state, dispatch, commit }, { page, callback }) {
    if (page === 1) {
      commit('clearStories')
    }
    axios.get(`/auth/spaces/${state.spaceId}/stories?&page=` + page)
      .then((res) => {
        if (state.stories.length === 0) {
          commit('setStories', res.data.stories)
        } else {
          commit('concatStories', res.data.stories)
        }
        commit('setTotalStories', res.data.total)
        if (state.totalStories !== state.stories.length && res.data.stories.length > 0) {
          dispatch('fetchStories', {
            page: page + 1,
            callback
          })
        } else {
          callback()
        }
      })
  },
  async fetchStory ({ state }, { id }) {
    const { data } = await axios.get(`/auth/spaces/${state.spaceId}/stories/${id}`)
    return data.story
  },
  async updateStory ({ state, commit }, { story }) {
    try {
      const storyId = story.id
      story.id = undefined
      const { data } = await axios.put(`/auth/spaces/${state.spaceId}/stories/${storyId}`, {
        story,
        force_update: 1
      })
      commit('updateStory', data.story)
    } catch (e) {
      commit('addFailedImport', story)
    }
  },
  async createStory ({ state, commit }, { story }) {
    try {
      const { data } = await axios.post(`/auth/spaces/${state.spaceId}/stories`, {
        story
      })
      commit('addStory', data.story)
    } catch (e) {
      commit('addFailedImport', story)
    }
  }
}
