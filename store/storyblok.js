import axios from 'axios'

export const state = () => ({
  stories: [],
  totalStories: 0,
  spaceId: undefined
})

export const mutations = {
  setStories (state, stories) {
    state.stories = stories
  },
  concatStories (state, stories) {
    state.stories = state.stories.concat(stories)
  },
  setTotalStories (state, total) {
    state.totalStories = total
  },
  setSpaceId (state, spaceId) {
    state.spaceId = spaceId
  }
}

export const actions = {
  fetchStories ({ state, dispatch, commit }, { page, callback }) {
    console.log(state.spaceId)
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
  }
}
