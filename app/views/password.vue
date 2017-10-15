<template>
  <div id="password-page">
    <div class="empty">
      <div class="empty-icon">
        <img src="/icons/favicon-96x96.png" alt="logo" />
      </div>
      <p class="empty-title h5">Watch-Later</p>
      <p class="empty-subtitle" v-if="!token">Reset your password</p>
      <p class="empty-subtitle" v-else>Set your new password</p>
      <div class="empty-action">
        <p class="toast toast-error" v-if="error">{{ error }}</p>
        <p class="toast toast-success" v-if="done && token">Your password has been saved. You can now <router-link :to="{ name: 'auth' }">log in</router-link>.</p>
        <p class="toast toast-success" v-else-if="done && !token">An email has been sent to you to continue the procedure of resetting your password.</p>
        <form @submit.prevent="onSubmitToken" v-else-if="token">
          <div class="form-group">
            <input class="form-input text-center" v-model="password" type="password" id="input-password-password" placeholder="Password" required>
          </div>
          <div class="form-group mt-2">
            <button class="btn btn-primary" :class="{ loading }" type="submit">Set new password</button>
          </div>
        </form>
        <form @submit.prevent="onSubmit" v-else>
          <div class="form-group">
            <input class="form-input text-center" v-model="email" type="email" id="input-password-email" placeholder="Email" required>
          </div>
          <div class="form-group mt-2">
            <button class="btn btn-primary" :class="{ loading }" type="submit">Recover password</button>
          </div>
        </form>
        <router-link :to="{ name: 'auth' }"><small>Return to login page</small></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import guards from '../router/guards'

export default {
  name: 'password',
  props: ['token'],

  beforeRouteEnter: guards.notConnected,
  beforeRouteUpdate: guards.notConnected,

  data () {
    return {
      email: '',
      password: '',
      done: false,
      error: null,
      loading: false
    }
  },

  methods: {
    ...mapActions(['recoverPasswordRequest', 'recoverPassword']),
    onSubmit () {
      if (!this.done && !this.loading && this.email) {
        this.loading = true
        this.error = null
        this.recoverPasswordRequest({ email: this.email }).then(() => {
          this.loading = false
          this.done = true
        }).catch(err => {
          this.loading = false
          this.error = err
        })
      }
    },
    onSubmitToken () {
      if (!this.done && !this.loading && this.token && this.password) {
        this.loading = true
        this.error = null
        this.recoverPassword({ token: this.token, password: this.password }).then(() => {
          this.loading = false
          this.done = true
        }).catch(err => {
          this.loading = false
          this.error = err
        })
      }
    }
  }
}
</script>

<style lang="scss">
#password-page {
  display: flex;
  align-content: center;
  height: 100vh;
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
