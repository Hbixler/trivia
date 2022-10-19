import VueRouter from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'EnterDetails',
        component: () => import('../components/EnterDetails'),
    },
    {
        path: '/questions',
        name: 'DisplayQuestions',
        component: () => import('../components/DisplayQuestions'),
        props: (route) => {
            return {
                settings: +route.params.setting,
            }
        }
    },
    {
        path: '/scores',
        name: 'ViewScore',
        component: () => import('../components/ViewScore'),
        props: (route) => {
            return {
                score: +route.params.score,
                numQuestions: +route.params.numQuestions
            };
        }

    }
];

export default new VueRouter({mode: 'history', routes: routes});