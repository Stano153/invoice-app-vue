<script setup>
import store from "@/store";
import router from "@/router";
import { useDark, useToggle } from "@vueuse/core";
import { computed } from "vue";

const isDark = useDark({
  selector: "body", 
  attribute: "theme", 
  valueDark: "custom-dark", 
});
const toggleDark = useToggle(isDark);

const isAuthenticated = computed(() => store.getters.isAuthenticated);

function logout() {
      store.dispatch('logout');
      router.replace('/login');
}



</script>

<template>
    <header>
        <div class="navbar__logo">
            <RouterLink to="/">
                <img src="@/assets/logomain.svg" alt="Main Logo">
            </RouterLink>
            <span></span>
        </div>
      
        <div :class="['navbar__items',{'end': !isAuthenticated}]">
            <div class="item" v-if="isAuthenticated">
                <RouterLink to="/">
                    <img src="../../assets/invoice.png" alt="analytics icon" width="25">
                </RouterLink>
            </div>
            <div class="item" v-if="isAuthenticated">
                <RouterLink to="/analytics">
                    <img src="../../assets/analytics.png" alt="analytics icon" width="25">
                </RouterLink>
            </div>
            <div class="darkmode item">
                <button @click="toggleDark()">
                    <img src="@/assets/icon-moon.svg" alt="Dark mode icon" v-if="!isDark">
                    <img src="../../assets/icon-sun.254daaaf.svg" alt="Light mode" v-else>
                </button>
            </div>
            <div class="signUp item" v-if="isAuthenticated">
                <button @click="logout">
                    <img src="@/assets/sign-out-alt.2c3199a4.svg" alt="Sign out">
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
header {
    position: fixed;
    left: 0;
    top:0;
    width:100px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: var(--background-nav-color);
    border-radius: 0 25px 25px 0;
    z-index: 1;
}

.navbar__logo {
    background-color: var(--button-color-primary);
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 25px 25px 0;
    height: 100px;
}

.navbar__logo a {
    z-index: 9999;
    transition: all .2s;
}

.navbar__logo:hover a {
    transform: scale(1.2);
}

.navbar__logo:hover span {
    top:30px;
    height: 70px;
}

.navbar__items {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

button {
    cursor: pointer;
    border: none;
    width: 30px;
    height: 30px;
    transition: all .2s;
}

a {
    transition: all .2s;
}

button:hover, a:hover {
    opacity: 0.75;
}

.item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding:30px 0 ;
}


.darkmode button {
    background-color: transparent;
}

.signUp {
    border-top: 1px solid var(--font-color-tertiary);
}

.signUp button {
    background-color: var(--button-color-primary);
    border-radius: 50%;
}


span{
    content: "";
    position: absolute;
    height: 50px;
    width: 100%;
    left: 0;
    top: 50px;
    background-color: var(--button-color-primary-light);
    border-radius: 20px 0;
    transition: .2s;
    z-index: 1000;
}

.end {
    justify-content: end;
}

@media screen and (max-width: 900px) {
header {
    position:fixed;
    top: 0;
    width:100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--background-nav-color);
    border-radius: 0 25px 25px 0;
    z-index: 1;
}
.navbar__logo {
    background-color: var(--button-color-primary);
    width: 100px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 25px 25px 0;
    height: 100px;
}

span{
    content: "";
    position: absolute;
    height: 50px;
    width: 100px;
    left: 0;
    top: 50px;
    background-color: var(--button-color-primary-light);
    border-radius: 20px 0;
    transition: .2s;
    z-index: 1000;
}
.navbar__items {
    height: 100%;
    width: 225px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
}
.signUp {
    display: flex;
    justify-content: center;
    border-top: none;
    border-left: 1px solid var(--font-color-tertiary);
}
.item {
    width: 50px;
    height: 100%;
    padding:30px 0 ;
}


.end {
    justify-content: end;
}
}

</style>