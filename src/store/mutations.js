import state from './state';
import uniqid from "uniqid";

const mutations = {
    addAttempt(username, score, numQuestions) {
        const attempt = {
            id: uniqid(),
            username: username,
            score: score,
            numQuestions: numQuestions
        };
        state.attempts.push(attempt);
    },
    editUsername(username) {
        state.username = username;
    }
}

export default mutations;