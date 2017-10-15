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
      tasks: ['check-in-theatres', 'check-movies-changes', 'check-movies-transmi', 'new-user', 'update-news'],
      taskName: 'update-news',
      loading: false,
      status: null,
      result: {},
      name: '',
      email: ''
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
