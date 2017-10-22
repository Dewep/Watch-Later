<template>
  <div id="admin" class="container">
    <h3 class="s-title">Administration</h3>
    <form class="form-horizontal" @submit.prevent="runTask()">
      <div class="form-group">
        <div class="col-3">
          <label class="form-label" for="admin-task-name">Task</label>
        </div>
        <div class="col-9">
          <select class="form-select" id="admin-task-name" v-model="taskName" required>
            <option v-for="task in tasks" :key="task" :value="task">{{ task }}</option>
          </select>
        </div>
      </div>
      <div class="form-group" v-if="taskName === 'new-user'">
        <div class="col-3">
          <label class="form-label" for="admin-user-name">Name</label>
        </div>
        <div class="col-9">
          <input class="form-input" id="admin-user-name" type="text" v-model="name" placeholder="Name of the new account" required>
        </div>
      </div>
      <div class="form-group" v-if="taskName === 'new-user'">
        <div class="col-3">
          <label class="form-label" for="admin-user-email">Email</label>
        </div>
        <div class="col-9">
          <input class="form-input" id="admin-user-email" type="email" v-model="email" placeholder="Email of the new account" required>
        </div>
      </div>
      <div class="form-group" v-if="taskName === 'new-user'">
        <div class="col-3">
          <label class="form-label" for="admin-user-admin">Admin</label>
        </div>
        <div class="col-9">
          <label class="form-switch">
            <input type="checkbox" id="admin-user-admin" v-model="isAdmin">
            <i class="form-icon"></i> Administrator account
          </label>
        </div>
      </div>
      <div class="form-group" v-if="taskName === 'movie-in-theatres' || taskName === 'movie-torrents' || taskName === 'movie-changes'">
        <div class="col-3">
          <label class="form-label" for="admin-tmdb-id">TMDB ID <sup>optional</sup></label>
        </div>
        <div class="col-9">
          <input class="form-input" id="admin-tmdb-id" type="number" v-model.number="tmdbId" placeholder="TMDB ID of the movie">
        </div>
      </div>
      <div class="form-group">
        <div class="col-3"></div>
        <div class="col-9">
          <button class="btn btn-primary" type="submit" :class="{ loading }">Run task</button>
        </div>
      </div>
    </form>
    <pre class="code" data-lang="JSON Response" v-if="status">
      <code><span class="label text-uppercase" :class="[status === 'success' ? 'label-success' : 'label-error']">{{ status }}</span><br><br>{{ formattedResult }}</code>
    </pre>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import guards from '../router/guards'

export default {
  name: 'admin',

  beforeRouteEnter: guards.admin,
  beforeRouteUpdate: guards.admin,

  data () {
    return {
      tasks: ['update-all', 'news', 'remove-old-movies', 'movie-changes', 'movie-in-theatres', 'movie-torrents', 'new-user'],
      taskName: 'update-all',
      loading: false,
      status: null,
      result: {},
      name: '',
      email: '',
      isAdmin: false,
      tmdbId: ''
    }
  },

  computed: {
    formattedResult () {
      return window.JSON.stringify(this.result, null, 4)
    }
  },

  methods: {
    ...mapActions(['runAdminTask']),
    runTask () {
      this.loading = true
      const parameters = {}

      if (this.taskName === 'new-user') {
        parameters.name = this.name
        parameters.email = this.email
      } else if (this.taskName === 'movie-in-theatres' || this.taskName === 'movie-torrents' || this.taskName === 'movie-changes') {
        if (this.tmdbId) {
          parameters.tmdbId = this.tmdbId
        }
      }

      this.runAdminTask({ taskName: this.taskName, parameters }).then(res => {
        this.status = res.status
        this.result = res.result
        this.loading = false
      }).catch(err => {
        this.status = 'general error'
        this.result = err
        this.loading = false
      })
    }
  }
}
</script>
