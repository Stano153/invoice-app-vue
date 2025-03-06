<script setup>
import { ref, computed } from 'vue';
import store from '@/store';
import router from '@/router';

const email = ref('');
const password = ref('');
const formIsValid = ref(true);
const mode = ref('login');
const isLoading = ref(false);
const error = ref(null);

const submitCaption = computed(() => {
      return mode.value === 'login' ? 'Login' : 'Signup';
});

const switchModeButton = computed(() => {
      return mode.value === 'login' ? 'Signup instead' : 'Login instead';
});

function switchAuthMode() {
    if(mode.value === 'login') {
        mode.value = 'signup';
    } else {
        mode.value = 'login'
    }
}

const submitForm = async() => {
    formIsValid.value = true;
    if(email.value === '' || !email.value.includes('@') || password.value.length < 6) {
        formIsValid.value = false;
        return;
    }
    
    isLoading.value = true;
    try {
        if(mode.value === 'login') {
                    await store.dispatch('login', {
                        email: email.value,
                        password: password.value
                    })
                } else {
                    await store.dispatch('signup', {
                        email: email.value,
                        password: password.value
                    })
                }
                router.replace('/');
            } catch(error) {
                error.value = error.message || 'Failed to fetch data';
            }
            
            isLoading.value = false;
        }

</script>

<template>
    <div class="container">

    <form @submit.prevent="submitForm">
        <h2>{{ submitCaption }}</h2>
        <div class="form-control">
            <label for="email">E-Mail</label>
            <input type="email" id="email"  v-model.trim="email" placeholder="Email" autocomplete="username">
        </div>
        <div class="form-control">
            <label for="password">Password</label>
            <input type="password" id="password" v-model.trim="password" placeholder="Password" autocomplete="current-password">
        </div>
        <p v-if="!formIsValid" class="error-message">Please enter a valid email and password must be at least 6 characters long!</p>
        <button class="btn btn--purple">{{ submitCaption }}</button>
        <button type="button" @click="switchAuthMode" class="switch-btn">{{ switchModeButton }}</button>
    </form>

    </div>
</template>

<style scoped>
.container {
    display: grid;
    place-content: center;
    height: 100dvh;
}

form {
    margin: auto;
    width: 300px;
    border: 1px solid var(--border-color-primary);
    border-radius: 5px;
    padding: 20px;
}

label {
    color: var(--font-color-secondary);
    font-size: .7rem;
}

input {
    outline: none;
    border: 1px solid var(--border-color-primary);
    background-color: var(--background-box-color);
    padding: 15px;
    width: 100%;
    margin: 10px 0 15px 0;
    transition: .2s;
    color: inherit;
    border-radius: 5px;
}

input:focus {
    border: 1px solid var(--button-color-primary);
}

h2 {
    margin-bottom: 10px;
}

.switch-btn {
    background-color: transparent;
    border: none;
    color: var(--font-color-primary);
    margin-left: 15px;
}

.error-message {
    font-size: .75rem;
    margin: 10px auto;
    color: var(--error-color);
    padding: 10px;
    border: 1px dashed var(--error-color);
    border-radius: 5px;
}
</style>