<template>
    <div v-if="settings && settings.numQuestions > 0 && settings.listView">
      <!-- Listing all questions at once -->
      <b-container class="questionbox mx-auto" v-for="(question, index) in questions" v-bind:key="`question-${index}`">
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
    <div v-else-if="settings && !settings.listView">
      <!-- One question at a time! -->
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
                <b-progress :max="settings.numQuestions" show-progress animated class="mt-3">
                  <b-progress-bar variant="success" :value="currentQuestion" :label="`${((currentQuestion / settings.numQuestions) * 100).toFixed(0)}%`"></b-progress-bar>
                </b-progress>
              </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
  name: 'DisplayQuestions',
  data() {
      return {
        questions: [],
        currentQuestion: 0,
        correctAnswers: 0,
        settings: this.$route.params.settings,
        error: ''
      }
  },
  mounted() {
    if (!this.settings) {
      // User got here illegally :o
      this.$router.push({name: 'EnterDetails'});
    }
    else {
      this.getData();
    }
  },
  methods: {
    async getData() {
      this.$axios
        .get('https://opentdb.com/api.php?amount=' + this.settings.numQuestions + ((this.settings.difficulty === 'any') ? '' : ('&difficulty=' + this.settings.difficulty)) + ((this.settings.category === '-1') ? '' : ('&category=' + this.settings.category)))
        .then(response => {
          this.questions = response.data.results;
          for (const question of this.questions) {
            question['userAnswer'] = null;
            question.question = this.decodeFromHTML(question.question);
            this.generateAnswers(question);
          }
        })
        .catch(err => {
          console.error(err);
        });
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
      if (question.type === 'boolean') {
        question['answers'] = ['True', 'False'];
      }
      else {
        // Data comes with correct and incorrect answers in separate arrays, here we assemble
        const answers = [];
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
      if (this.currentQuestion + 1 === this.settings.numQuestions) {
        this.score();
      }
      else {
        this.questions[this.currentQuestion].userAnswer = answer;
        this.currentQuestion++;
      }
    },
    answerQuestion(answer, questionIndex) {
      this.questions[questionIndex].userAnswer = answer;
    },
    checkErrors() {
      // Only checks for unanswered questions
      this.error = '';
      const nullAnswers = [];
      for (let x = 0; x < this.questions.length; x++) {
        const question = this.questions[x];
        if (question.userAnswer === null) {
          // User did not answer!
          nullAnswers.push(`${x + 1}`);
          this.correctAnswers = 0;
          this.error = 'Please answer all questions first :)';
        }
      }
      if (nullAnswers.length === 1) {
        this.error = 'Please answer Question ' + nullAnswers[0] + ' :)';
      }
      else if (nullAnswers.length > 1) {
        this.error = 'Please answer the following questions:';
        for (let x = 0; x < nullAnswers.length; x++) {
          const answer = nullAnswers[x];
          this.error += ' ' + answer;
          if (x !== nullAnswers.length - 1) {
            this.error += ',';
          }
        }
      }
    },
    score() {
      if (this.settings.listView) {
        // No possible errors for one-at-a-time at this moment
        this.checkErrors();
      }
      for (let x = 0; x < this.questions.length; x++) {
        const question = this.questions[x];
        if (question.userAnswer === question.correct_answer) {
          this.correctAnswers++;
        }
      }
      if (this.error.length === 0) {
        this.$store.actions.addAttempt(this.correctAnswers, this.settings.numQuestions);
        this.$router.push({name: 'ViewScore', params: {score: this.correctAnswers, numQuestions: this.settings.numQuestions}});
      }
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.questionbox {
  padding: 0px;
  width: 95%;
  margin: 20px 5px 5px 5px;
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
