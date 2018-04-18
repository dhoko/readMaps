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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const getSourceMap = async (url) => {
    const response = await got(url);
    return response.body;
};

const parse = async (body) => {
    try {
        return {
            output: await sourceMap.format(body, '(appLazy|app)', getSourceMap)
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
    const { body = '' } = req.body || {};
    parse(body)
        .then(({ status = 200, output }) => res.status(status).send(output))
        .catch(next);
});

app.listen(1442, () => {
    console.log('3615 readMaps port@1442!');
});
