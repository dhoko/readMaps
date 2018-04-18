import { h, app } from 'hyperapp';
import * as actions from './actions';
import 'babel-polyfill';

const view = (state, actions) => {
    return (
        <main>
            <header>
                <h1>Read source Maps</h1>
            </header>

            <form onsubmit={(e) => (e.preventDefault(), actions.submit())}>
                <div>
                    <textarea
                        cols="100"
                        rows="20"
                        name="sourcemap"
                        oninput={({ target: { value } }) => {
                            state.body = value;
                        }}
                    />
                </div>
                <button>Beautify</button>
            </form>

            {state.output && <pre>{state.output}</pre>}
        </main>
    );
};

(async () => {
    try {
        const data = {};
        console.log('INIT', data);

        app(data, actions, view, document.body);
    } catch (e) {
        console.error(e);
    }
})();
