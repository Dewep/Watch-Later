<template>
  <div id="auth-page">
    <div class="empty">
      <p class="empty-title h5">Watch-Later</p>
      <p class="empty-subtitle">Authentication required</p>
      <div class="empty-action">
        <form @submit.prevent="onSubmit">
          <p class="toast toast-success" v-if="user">Connecting...</p>
          <p class="toast toast-error" v-if="authRequest.error">{{ authRequest.error }}</p>
          <div class="form-group">
            <input class="form-input text-center" v-model="email" type="email" id="input-auth-email" placeholder="Email" />
          </div>
          <div class="form-group">
            <input class="form-input text-center" v-model="password" type="password" id="input-auth-password" placeholder="Password" />
          </div>
          <div class="form-group mt-2">
            <button class="btn btn-primary" :class="{ loading: authRequest.loading }" type="submit">Connection</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import guards from '../router/guards'

export default {
  name: 'auth',

  beforeRouteEnter: guards.notConnected,
  beforeRouteUpdate: guards.notConnected,

  data () {
    return {
      email: '',
      password: ''
    }
  },

  computed: mapGetters(['authRequest', 'user']),

  methods: {
    ...mapActions(['auth']),
    onSubmit () {
      if (this.email && this.password && !this.authRequest.loading) {
        this.auth({ email: this.email, password: this.password })
      }
    }
  },

  watch: {
    user (newUser) {
      if (newUser) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style lang="scss">
#auth-page {
  display: flex;
  align-content: center;
  height: 100%;
  margin: 0;
  padding: 0;
  min-width: 320px;
  overflow: hidden;
  background: #f8f9fa;
  align-items: center;

  > .empty {
    flex: 1 1 auto;
    max-width: 700px;
    margin: 0 auto;
  }
}
</style>
