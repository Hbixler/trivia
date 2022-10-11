<template>
    <b-container class="numQuestions">
      <b-row>
        <b-col>Select desired number of questions</b-col>
      </b-row>
      <b-row>
          <b-col><b-form-input v-model="number" type="range" min="5" max="20"></b-form-input></b-col>
      </b-row>
      <b-row>
          <b-col><p v-if="number != ''">You entered {{ number }}</p></b-col>
      </b-row>
      <b-row>
          <b-col><b-button @click="generate(number)">Generate Questions</b-button></b-col>
      </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'EnterDetails',
  data() {
      return {
          number: ''
      }
  },
  methods: {
      generate(number) {
          this.number = number
          //alert("Your number is " + number )
          this.$emit('setnum', this.number)
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
</style>
