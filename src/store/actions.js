import mutations from './mutations';
import getters from './getters';

const actions = {
    addAttempt(score, numQuestions) {
        const username = getters.getUsername();
        mutations.addAttempt(username, score, numQuestions);
    },
    editUsername(username) {
        mutations.editUsername(username);
    }
};

export default actions;