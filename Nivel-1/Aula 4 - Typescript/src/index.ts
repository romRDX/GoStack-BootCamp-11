import express from 'express';

import {HelloReact} from './routes';
const app = express();

app.get('/', HelloReact);

app.listen(3333);