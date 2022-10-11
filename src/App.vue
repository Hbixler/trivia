<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <enter-details v-on:newquestions="newQuestions"></enter-details>
    <display-questions v-on:updated="updated" :settings="{numQuestion: numQuestion, difficulty: difficulty, listView: listView, update: update}"></display-questions>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import DisplayQuestions from './components/DisplayQuestions.vue';
import EnterDetails from './components/EnterDetails.vue';
//import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'App',
  components: {
    'enter-details': EnterDetails,
    'display-questions': DisplayQuestions
  },
  data () {
    return {
      numQuestion: 0,
      difficulty: 'easy',
      listView: 1,
      update: 0
    }
  },
  methods: {
    newQuestions(settings) {
      //alert("Button pressed")
      this.numQuestion = settings.num
      this.difficulty = settings.difficulty
      this.listView = settings.listView
      this.update = 1
    },
    updated() {
      this.update = 0
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.questionbox {
  padding: 10px;
  margin-bottom: 40px;
}
.question {
  background-color: rgb(27, 90, 74);
  color: white;
  border: 1px solid black;
}
.answers {
  background-color: rgb(119, 194, 175)
}
</style>
