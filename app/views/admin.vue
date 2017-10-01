<template>
  <div id="admin" class="container">
    <h3 class="s-title">Administration</h3>
    <form class="form-horizontal" @submit.prevent="runTask()">
      <div class="form-group">
        <div class="col-3">
          <label class="form-label" for="admin-task-name">Task</label>
        </div>
        <div class="col-9">
          <select class="form-select" id="admin-task-name" v-model="taskName">
            <option v-for="task in tasks" :key="task" :value="task">{{ task }}</option>
          </select>
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
      result: {}
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
        // ...
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
