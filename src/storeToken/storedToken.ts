import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
    let token = ref<string>('');

    function setToken(value: string) {
        localStorage.setItem('book_token', value);
        token.value = value;
    }
    return { token, setToken }
})

