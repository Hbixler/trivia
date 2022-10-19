
//Data validation
<template>
    <b-container class="mt-3">
      <!-- <b-button v-b-toggle.collapse-settings id="showhide">Show/Hide Settings</b-button>
      <b-collapse id="collapse-settings">-->
        <b-row>
          <b-col><center><b>Settings</b></center></b-col>
        </b-row>
        <b-card>
          <b-row class="mb-2">
            <b-col>Select number of questions: {{ number }}</b-col>
            <b-col>Select difficulty: {{ difficulty[0].toUpperCase() + difficulty.slice(1) }}</b-col>
            <b-col>Select category: {{ categoryOptions.find(choice => choice.value === category).text }}</b-col>
            <b-col>Select mode:</b-col>
          </b-row>
          <b-row>
              <b-col><b-form-input v-model="number" type="range" min="5" max="20"></b-form-input></b-col>
              <b-col>
                <b-form-select v-model="difficulty" :options= "difficultyOptions"></b-form-select>
              </b-col>
              <b-col>
                <b-form-select v-model="category" :options="categoryOptions"></b-form-select>
              </b-col>
              <b-col class="modeOptions">
                <b-form-group v-slot="{ modeOptions }">
                  <b-form-radio name="mode" v-model="listView" :aria-describedby="modeOptions" id="list" value="1">All At Once</b-form-radio>
                  <b-form-radio name="mode" v-model="listView" :aria-describedby="modeOptions" id="onebyone" value="0">One At A Time</b-form-radio>
                </b-form-group>
              </b-col>
          </b-row>
        </b-card>
      <b-row class="mt-5">
        <b-col class="my-auto">Enter Username: </b-col>
        <b-col class="my-auto">
          <b-form-input placeholder="Username" v-model="username" :state="error.length === 0 ? null: false"></b-form-input>
        </b-col>
        <b-col class="my-auto">
          <b-button id="generate" @click="generate()">New Questions!</b-button>
        </b-col>
      </b-row>
      <b-row v-if="error">
        <b-col><span style="color:red">{{ error }}</span></b-col>
      </b-row>
  </b-container>
</template>

<script>
import store from '../store';
export default {
  name: 'EnterDetails',
  data() {
      return {
          number: 10,
          username: null,
          difficultyOptions: [
            {value: "any", text: "Any"},
            {value: "easy", text: "Easy"},
            {value: "medium", text: "Medium"},
            {value: "hard", text: "Hard"}
          ],
          difficulty: 'any',
          category: '-1',
          categoryOptions: [
            {value: '-1', text: 'All Categories'},
            {value: '9', text: 'General Knowledge'},
            {value: '10', text: 'Books'},
            {value: '17', text: 'Science & Nature'},
            {value: '20', text: 'Mythology'},
            {value: '23', text: 'History'},
            {value: '27', text: 'Animals'}
          ],
          listView: 0,
          error: '',
          usernameFlag: false
      }
  },
  watch: {
    username() {
      if (this.username.trim().length > 0) {
        this.usernameFlag = true;
      }
      this.checkErrors();
    },
  },
  mounted() {
    // console.log('mounted again');
    this.username = store.getters.getUsername();
    // console.log('username is ', this.username);
  },
  methods: {
    checkErrors() {
      if (this.usernameFlag && (this.username == null || this.username.trim() === '')) {
        this.error = "Please enter a username.";
      }
      else if (this.username.trim().length > 10) {
        this.error = "Username must be less than 10 characters.";
      }
      else {
        this.error = '';
      }
    },
    generate() {
      this.usernameFlag = true;
      this.checkErrors()
      if (this.error.length === 0) {
        store.actions.editUsername(this.username);
        const settings = {
        difficulty: this.difficulty,
        listView: this.listView,
        numQuestion: this.number,
        category: this.category
        }
        // console.log(settings);
        //alert("Your number is " + number )
        this.$router.push({name: 'DisplayQuestions', params: {settings: settings}});
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modeOptions {
  text-align: left;
}
</style>
