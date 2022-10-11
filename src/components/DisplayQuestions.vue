//To add: Actually scoring??
//To fix: Should only allow submitting one at a time
//To fix: Isn't doing data validation right (after question one doesn't let blank)
//To fix: Should be able to switch mode without generating new questions

<template>
    <div v-if="settings.numQuestion > 0 && settings.listView == 1">
      <b-container class="questionbox" v-for="(question, index) in info" v-bind:key="index">
        <b-row class="question" align-h="center">
          <b-col md="auto">
            <p>{{ question.question }}</p>
          </b-col>
        </b-row>
        <b-row class="answers" align-h="center">
          <b-col>
            <b-form-group v-slot="{ thegroup }">
            <b-form-radio-group :name="index" v-model="selected" :aria-describedby="thegroup" :options="answers[index]"></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
      <b-button>Submit Answers</b-button>
    </div>
    <div v-else-if="settings.listView == 0">
        <b-container>
            <b-row>
                <b-col align-self="center" md="auto"><b-button id="navigator" variant="outline-secondary" :disabled="currentQuestion == 1" @click="previous()">Previous Question</b-button></b-col>
                <b-col>
                    <b-container class="questionbox">
                        <b-row class="question" align-h="center">
                            <b-col md="auto">
                                <p>{{ currentQuestion }}. {{ info[currentQuestion - 1].question }}</p>
                            </b-col>
                        </b-row>
                        <b-row class="answers" align-h="center">
                            <b-col>
                                <b-form-group v-slot="{ thegroup }">
                                <b-form-radio-group :name="currentQuestion" v-model="selected" :aria-describedby="thegroup" :options="answers[currentQuestion - 1]"></b-form-radio-group>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-col>
                <b-col align-self="center" md="auto"><b-button id="navigator" variant="outline-secondary" @click="next(selected)">
                  <span v-if="currentQuestion < settings.numQuestion">Next Question</span><span v-else>Submit Answers</span></b-button></b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-progress :max="settings.numQuestion" show-progress animated>
                  <b-progress-bar variant="success" :value="currentQuestion" :label="`${((currentQuestion / settings.numQuestion) * 100).toFixed(0)}%`"></b-progress-bar>
                </b-progress>
              </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
  name: 'EnterDetails',
  props: {
      settings: {
          numQuestion: Number, 
          difficulty: String,
          listView: Number,
          update: Number
        },
  },
  data() {
      return {
        info: [],
        answers: [],
        currentQuestion: 1,
        correctAnswers: 0
      }
  },
  watch: {
      settings(newSetting) {
          if (this.settings.update == 1) {
              this.newQuestions(newSetting.numQuestion, newSetting.difficulty, newSetting.listView)
          }
      }
  },
  methods: {
      async getData() {
      try {
        //alert("Running get data")
        let response = await fetch('https://opentdb.com/api.php?amount=' + this.settings.numQuestion + '&difficulty=' + this.settings.difficulty)
        //alert('https://opentdb.com/api.php?amount=' + this.numQuestion)
        this.info = await response.json()
        this.info = this.info.results
        this.generateAnswers()
      } catch (error) {
        console.log(error)
      }
    },
    generateAnswers() {
      //alert("Being called")
      for (let x = 0; x < this.info.length; x++) {
        //alert("entering for loop")
        //alert("Correct answer is" + this.info[x].correct_answer)
        this.answers.push([this.info[x].correct_answer])
        for (let y = 0; y < this.info[x].incorrect_answers.length; y++) {
          this.answers[x].push(this.info[x].incorrect_answers[y])
        }
        // alert("Answer length is" + this.answers.length)
      }
    },
    previous() {
        if (this.currentQuestion > 1) {
            this.currentQuestion--
        }
    },
    next(selected) {
      alert("Selected is " + selected)
      if (selected == undefined || !(selected in this.answers[this.currentQuestion - 1])) {
        alert("Answers at 0 is " + this.answers[this.currentQuestion - 1][0])
        alert("Select an option first!")
      }
      else if (this.currentQuestion == this.settings.numQuestion) {
        this.score()
      }
      else {
        if (selected == this.info[this.currentQuestion - 1].correct_answer) {
          //alert("You got it right!")
          this.correctAnswers++
        }
        this.currentQuestion++
      }
    },
    newQuestions(num, diff, listView) {
    //alert("Running")
    this.settings.numQuestion = num
    this.settings.difficulty = diff
    this.settings.listView = listView
    this.settings.update = 0
    this.currentQuestion = 1
    this.info = []
    this.answers = []
    this.$emit('updated')
    this.getData()
    },
    score() {
      alert("You got " + this.correctAnswers + " out of " + this.settings.numQuestion + " correct!")
      this.correctAnswers = 0
    }
  },
  created() {
      this.getData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
