import { h, app } from 'hyperapp';
import * as actions from './actions';
import 'babel-polyfill';

const s = `RangeError: Maximum call stack size exceeded at String.replace () at https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:725627 at m.action (https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:719808) at https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:719872 at f (https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:672754) at Object. (https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:673174) at j (https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:232767) at Generator._invoke (https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:232555) at Generator.e.(anonymous function) [as next] (https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:232946) at n (https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:2934)`;

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
        const data = { body: s };
        console.log('INIT', data);

        const main = app(data, actions, view, document.body);
    } catch (e) {
        console.error(e);
    }
})();
