<template>
    <b-container class="mb-3">
      <b-row class="mb-4">
        <b-col v-if="score !== null && numQuestions"><center><h3>You scored {{ score }}/{{ numQuestions }}!</h3></center></b-col>
      </b-row>
      <b-row v-if="items.length > 0">
        <b-col class="mb-2">
          <b-form-input placeholder="Search Usernames..." type="search" v-model="usernameSearchInput"></b-form-input>
        </b-col>
      </b-row>
      <b-table :items="filteredItems" :fields="fields" :current-page="currentPage" fixed :per-page="10" id="attempts" v-if="itemCount > 0" sort-by="score" :sort-desc="true">
        <template v-slot:cell(score) = "{ item }">
          {{ item.score }}%
        </template>
      </b-table>
      <b-row class="mb-3" v-else-if="items.length === 0"><center>Take a quiz in order to get a score!</center></b-row>
      <b-row class="mb-3" v-else><center>No scores for this username!</center></b-row>
      <b-pagination v-if="itemCount > 10" v-model="currentPage" :total-rows="itemCount" :per-page="10" aria-controls="attempts" align="center" pills></b-pagination>
      <b-button @click="$router.push({name: 'EnterDetails'})">New Quiz</b-button>
  </b-container>
</template>

<script>
import store from '../store'
export default {
  name: 'ViewScore',
  data() {
      return {
          score: this.$route.params.score,
          numQuestions: this.$route.params.numQuestions,
          items: [],
          fields: [
            { key: 'username' },
            { key: 'num_correct' },
            { key: 'total_questions' },
            { key: 'score'}
          ],
          itemCount: 0,
          currentPage: 1,
          usernameSearchInput: '',
          prevSearchInput: '',
          prevFilterId: 0,
          filteredItems: []
      }
  },
  computed: {
    attempts() {
      // console.log(store.state);
      return store.getters.getAttempts();
    }
  },
  watch: {
    usernameSearchInput(newInput) {
      this.filterRows(newInput);
    }
  },
  methods: {
      filterRows(filter) {
        this.currentPage = 1;
        if (filter.trim() === '' || filter === null) {
          // No filter!
          this.filteredItems = this.items;
          this.itemCount = this.items.length;
        }
        else {
          this.itemCount = 0;
          this.filteredItems = [];
          const input = filter.toLowerCase().trim().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(input);
          for (const item of this.items) {
            if (regex.test(item.username.toLowerCase())) {
              this.filteredItems.push(item);
              this.itemCount++;
            }
          }
        }
      },
      searchUsernames(row) {
        console.log('new search');
        if (this.usernameSearchInput.trim() === '') {
          return true;
        }
        else if (this.usernameSearchInput !== this.prevSearchInput) {
          // console.log('new search');
          console.log('input is ', this.usernameSearchInput);
          this.itemCount = 0;
          this.currentPage = 1;
          this.prevFilterId = 0;
        }
        const input = this.usernameSearchInput.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(input);
        this.prevSearchInput = this.usernameSearchInput;
        const result = regex.test(row.username.toLowerCase());
        // console.log('username is ', row.username.toLowerCase());
        // console.log('result is ', result)
        if (result) {
          // console.log('row id is ', row.id);
          if (row.id !== this.prevFilterId && this.prevFilterId !== -1) {
            // console.log('increasing item count');
            this.itemCount++;
            this.prevFilterId = row.id;
          }
          else {
            this.prevFilterId = -1;
          }
        }
        // console.log('returning ', result);
        return result;
      },
      fillTable() {
        this.itemCount = this.attempts.length;
          for (const attempt of this.attempts) {
            const newItem = {};
            newItem['id'] = attempt.id;
            newItem['username'] = attempt.username;
            newItem['num_correct'] = attempt.score;
            newItem['total_questions'] = attempt.numQuestions;
            newItem['score'] = 100 * (attempt.score / attempt.numQuestions).toFixed(2);
            if (attempt.id === this.attempts[this.itemCount - 1].id) {
              newItem['_rowVariant'] = 'warning';
            }
            this.items.push(newItem);
            this.filteredItems.push(newItem);
          }
      }
  },
  mounted() {
    this.fillTable();
    // console.log('viewing score')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
  color: white;
}
a:hover {
  color: rgb(175, 175, 175);
}
</style>
