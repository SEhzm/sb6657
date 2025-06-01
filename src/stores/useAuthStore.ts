import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const loginVisible = ref(false)
    const userId = ref<number>(0)

    function showLogin() {
        loginVisible.value = true
    }

    function hideLogin() {
        loginVisible.value = false
    }

    function setUserId(id: number) {
        userId.value = id
    }

    return {
        loginVisible,
        userId,
        showLogin,
        hideLogin,
        setUserId
    }
})