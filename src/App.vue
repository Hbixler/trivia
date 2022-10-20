<template>
  <div id="app">
    <div id="navBar">
    <span>
      <router-link :to="{name: 'EnterDetails'}">Home</router-link>
       | 
       <router-link :to="{name: 'ViewScore', params: {score: null, numQuestions: null}}">Leaderboard</router-link>
    </span>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#navBar {
  margin-bottom: 20px;
  background-color: rgb(27, 90, 74);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 5px;
  color: white;
}
</style>
