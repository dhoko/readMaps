const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sourceMap = require('parse-source-maps');
const got = require('got');
const compression = require('compression');

/**
 * Force osef ssl when we download the sourcemap
 * @link { https://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa }
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(
    cors({
        credentials: true,
        origin: true
    })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/../dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../dist/index.html'));
});
// parse application/json
app.use(bodyParser.json());
app.use(compression());

const getSourceMap = async (url) => {
    const response = await got(url);
    return response.body;
};

const parse = async (url, body) => {
    try {
        const [urlMap = '', name] = url.match(/(app|appLazy)\..+/);
        console.log({ urlMap, name, url });
        const map = await getSourceMap(url);
        const info = sourceMap.readder([urlMap], { [name]: map });
        return {
            output: sourceMap.extract.convert(body, info).join('\n')
        };
    } catch (e) {
        console.log(e);
        return {
            status: 401,
            output: 'Cannot parse the source map'
        };
    }
};

app.post('/convert', (req, res, next) => {
    const list = req.body.body.split('https');
    const str = list.find((item) => /(:\/\/.+\.js):/.test(item || '')) || '';
    const [url] = str.split('.js');
    parse(`https${url}.js.map`, req.body.body)
        .then(({ status = 200, output }) => res.status(status).send(output))
        .catch(next);
});

app.post('/', (req, res, next) => {
    const list = req.body.body.split('https');
    const str = list.find((item) => /(:\/\/.+\.js):/.test(item || ''));
    const [url] = str.split('.js');
    parse(`https${url}.js.map`, req.body.body)
        .then((map) => res.send(map))
        .catch(next);
});

app.listen(1442, () => {
    console.log('Example app listening on port 1442!');
});
