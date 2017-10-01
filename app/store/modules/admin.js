import adminApi from '../../api/admin'

const state = {
}

const getters = {
}

const actions = {
  runAdminTask ({ commit }, { taskName, parameters }) {
    return adminApi.runTask(taskName, parameters)
  }
}

const mutations = {
}

export default { state, getters, actions, mutations }
