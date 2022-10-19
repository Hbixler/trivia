// Add semi-colons and ===
// When I go to new page while on search filter and then clear filter, weird things happen

// Make sure I understand Durstenfeld shuffle!
// Understand DOM Parser
// Understand how routers work
// Export vs export default
// Vue lifecycle

<template>
    <div v-if="settings.numQuestion > 0 && settings.listView == 1">
      <b-container class="questionbox" v-for="(question, index) in questions" v-bind:key="`question-${index}`">
        <b-row class="question mx-auto">
          <b-col md="auto" v-if="question">
            <p>{{ index + 1 }}. {{ question.question }}</p>
          </b-col>
        </b-row>
        <b-row class="answers mx-auto">
          <b-col v-if="question">
            <div v-for="(answer, index2) in question.answers" :key="`answer-${index2}`">
              <b-form-radio :name="`question-${index}`" @input="answerQuestion(answer, index)">{{ answer }}</b-form-radio>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <b-row class="mb-2">
        <b-col><span style="color:red">{{ error }}</span></b-col>
      </b-row>
      <b-row>
        <b-col><b-button class="mb-3" @click="score()">Submit Answers</b-button></b-col>
      </b-row>
    </div>
    <div v-else-if="settings.listView == 0">
        <b-container class="mb-5">
            <b-row>
                <b-col>
                    <b-container class="questionbox" v-if="questions[currentQuestion]">
                        <b-row class="question mx-auto">
                            <b-col md="auto" v-if="questions[currentQuestion]">
                                <p>{{ currentQuestion + 1 }}. {{ questions[currentQuestion].question }}</p>
                            </b-col>
                        </b-row>
                        <b-row class="answers mx-auto">
                          <b-row class="mx-auto" v-for="rowIndex in questions[currentQuestion].answers.length / 2" :key="rowIndex">
                            <b-col v-for="colIndex in 2" :key="colIndex" class="answer mx-auto">
                              <b-button class="button" variant="outline-dark" @click="next(questions[currentQuestion].answers[colIndex + (rowIndex - 1) * 2 - 1])">{{ questions[currentQuestion].answers[colIndex + (rowIndex - 1) * 2 - 1] }}</b-button>
                            </b-col>
                          </b-row>
                        </b-row>
                    </b-container>
                </b-col>
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
import store from '../store';
export default {
  name: 'DisplayQuestions',
  data() {
      return {
        questions: [],
        answers: [],
        currentQuestion: 0,
        currentAnswer: null,
        correctAnswers: 0,
        settings: this.$route.params.settings,
        error: ''
      }
  },
  mounted() {
    // console.log(this.username);
    // console.log(this.settings);
    this.getData();
  },
  methods: {
      async getData() {
      try {
        //alert("Running get data")
        let response = await fetch('https://opentdb.com/api.php?amount=' + this.settings.numQuestion + ((this.settings.difficulty === 'any') ? '' : ('&difficulty=' + this.settings.difficulty)) + ((this.settings.category === '-1') ? '' : ('&category=' + this.settings.category)));
        // console.log('https://opentdb.com/api.php?amount=' + this.settings.numQuestion + 
        //alert('https://opentdb.com/api.php?amount=' + this.numQuestion)
        const info = await response.json()
        this.questions = info.results
        for (const question of this.questions) {
          question['userAnswer'] = null;
          question.question = this.decodeFromHTML(question.question);
          this.generateAnswers(question);
        }
        // console.log(this.questions);
      } catch (error) {
        console.error(error)
      }
    },
    decodeFromHTML(text) {
      const parser = new DOMParser().parseFromString(text, "text/html");
      return parser.documentElement.textContent;
    },
    shuffle(arr) {
      for (let x = arr.length - 1; x > 0; x--) {
        const randElement = Math.floor(Math.random() * (x + 1));
        const temp = arr[x];
        arr[x] = arr[randElement];
        arr[randElement] = temp;
      }
    },
    generateAnswers(question) {
      //alert("Being called")
      if (question.type == 'boolean') {
        question['answers'] = ['True', 'False'];
      }
      else {
        let answers = [];
        question.correct_answer = this.decodeFromHTML(question.correct_answer);
        answers.push(question.correct_answer);
        for (let answer of question.incorrect_answers) {
          answer = this.decodeFromHTML(answer);
          answers.push(answer);
        }
        this.shuffle(answers);
        question['answers'] = answers;
      }
    },
    next(answer) {
      // console.log(answer);
      // alert("Selected is " + selected)
      // const question = this.questions[this.currentQuestion];
      if (this.currentQuestion + 1 == this.settings.numQuestion) {
        // console.log('going to score');
        this.score();
      }
      else {
        // this.currentAnswer = this.questions[this.currentQuestion+1].userAnswer;
        this.questions[this.currentQuestion].userAnswer = answer;
        this.currentQuestion++;
        // this.currentAnswer = this.questions[this.currentQuestion].userAnswer;
      }
    },
    answerQuestion(answer, questionIndex) {
      // console.log('question ', questionIndex, ' being answered with answer ', answer)
      this.questions[questionIndex].userAnswer = answer
    },
    score() {
      this.error = '';
      for (const question of this.questions) {
        if (question.userAnswer === null && this.settings.listView !== 0) {
          this.correctAnswers = 0;
          this.error = 'Please answer all questions first :)';
          break;
        }
        if (question.userAnswer === question.correct_answer) {
          this.correctAnswers++;
        }
      }
      if (this.error.length === 0) {
        store.actions.addAttempt(this.correctAnswers, this.settings.numQuestion);
        this.$router.push({name: 'ViewScore', params: {score: this.correctAnswers, numQuestions: this.settings.numQuestion}});
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
.questionbox {
  padding: 0px;
  margin-bottom: 20px;
}
.question {
  background-color: rgb(27, 90, 74);
  color: white;
  border: 1px solid black;
  text-align: left;
  padding: 3px;
  border-radius: 5px 5px 0px 0px;
  width: 100%;
}
.answers {
  background-color: rgb(119, 194, 175);
  text-align: left;
  padding: 3px;
  border-radius: 0px 0px 5px 5px;
}
.answer {
  padding: 2px;
  margin: 3px;
}
.button {
  width: 99%;
  height: 99%;
}
</style>
