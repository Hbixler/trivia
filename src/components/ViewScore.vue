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
          {{ item.score.toFixed(0) }}%
        </template>
      </b-table>
      <b-row class="mb-3" v-else-if="items.length === 0"><center>Take a quiz in order to get a score!</center></b-row>
      <b-row class="mb-3" v-else><center>No scores for this username!</center></b-row>
      <b-pagination v-if="itemCount > 10" v-model="currentPage" :total-rows="itemCount" :per-page="10" aria-controls="attempts" align="center" pills></b-pagination>
      <b-button @click="$router.push({name: 'EnterDetails'})">New Quiz</b-button>
  </b-container>
</template>

<script>
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
          filteredItems: []
      }
  },
  watch: {
    usernameSearchInput(newInput) {
      this.filterRows(newInput);
    }
  },
  mounted() {
    this.attempts = this.$store.getters.getAttempts();
    this.fillTable();
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
      fillTable() {
        this.itemCount = this.attempts.length;
          for (const attempt of this.attempts) {
            const newItem = {};
            newItem['id'] = attempt.id;
            newItem['username'] = attempt.username;
            newItem['num_correct'] = attempt.score;
            newItem['total_questions'] = attempt.numQuestions;
            newItem['score'] = 100 * (attempt.score / attempt.numQuestions);
            if (attempt.id === this.attempts[this.itemCount - 1].id) {
              // Most recent attempt
              newItem['_rowVariant'] = 'warning';
            }
            this.items.push(newItem);
            this.filteredItems.push(newItem);
          }
      }
  }
}
</script>

<style>
h3 {
  margin: 40px 0 0;
}
a {
  color: white;
}
a:hover {
  color: rgb(175, 175, 175);
}
</style>
