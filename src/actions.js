import axios from 'axios';
const request = axios.create({
    baseURL: 'http://localhost:1442/',
    withCredentials: true
});

export const setOutput = (output) => ({ output });

export const submit = () => async (state, actions) => {
    try {
        const data = await request.post('convert', { body: state.body });
        actions.setOutput(data.data);
    } catch (e) {
        actions.setOutput(e.response.data);
    }
};
