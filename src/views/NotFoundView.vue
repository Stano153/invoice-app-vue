<template>
    <div>
        <h1>PAGE NOT FOUND</h1>
        <p>Please Login to access the app!</p>
        <RouterLink to="/login" class="btn btn--purple">Login</RouterLink>
    </div>
</template>

<style scoped>
div {
    display: grid;
    place-content: center;
    height: 100dvh;
    text-align: center;
}
p {
    margin-top: 5px;
    margin-bottom: 15px;
}
</style>