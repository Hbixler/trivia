
//Data validation
<template>
    <b-container class="numQuestions">
      <b-button v-b-toggle.collapse-settings id="showhide">Show/Hide Settings</b-button>
      <b-collapse id="collapse-settings">
        <b-card>
          <b-row>
            <b-col>Select desired number of questions: {{ number }}</b-col>
            <b-col>Select difficulty: {{ difficulty }}</b-col>
            <b-col>Select mode:</b-col>
          </b-row>
          <b-row>
              <b-col><b-form-input v-model="number" type="range" min="5" max="20"></b-form-input></b-col>
              <b-col>
                <b-form-select v-model="difficulty" :options = "options"></b-form-select>
              </b-col>
              <b-col>
                <b-form-group v-slot="{ thegroup }">
                  <b-form-radio name="mode" v-model="listView" :aria-describedby="thegroup" id="list" value="1">All At Once</b-form-radio>
                  <b-form-radio name="mode" v-model="listView" :aria-describedby="thegroup" id="onebyone" value="0">One At A Time</b-form-radio>
                </b-form-group>
              </b-col>
          </b-row>
        </b-card>
      </b-collapse>
      <b-row>
          <b-col><b-button id="generate" @click="generate(number)">Generate New Questions</b-button></b-col>
      </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'EnterDetails',
  data() {
      return {
          number: 10,
          options: [
            {value: "easy", text: "Easy"},
            {value: "medium", text: "Medium"},
            {value: "hard", text: "Hard"}
          ],
          difficulty: '',
          listView: 0
      }
  },
  methods: {
      generate(number) {
          this.number = number
          //alert("Your number is " + number )
          this.$emit('newquestions', {num: this.number, difficulty: this.difficulty, listView: this.listView})
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#collapse-settings, #showhide, #generate {
  margin-bottom: 20px;
}
</style>
