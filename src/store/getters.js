import state from './state';

const getters = {
    getAttempts() {
        return state.attempts;
    },
    getUsername() {
        return state.username;
    }
};

export default getters;