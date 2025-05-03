import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loginVisible: false,
  }),
  actions: {
    showLogin() {
      this.loginVisible = true
    },
    hideLogin() {
      this.loginVisible = false
    }
  }
})