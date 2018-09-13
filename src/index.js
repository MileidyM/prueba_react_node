import React from 'react';
import ReactDOM from 'react-dom';

import {browserHistory} from 'react-router';

import Routes from './config/routes';

import './css/index.css';
import registerServiceWorker from './Componentes/registerServiceWorker';

ReactDOM.render(<Routes history={browserHistory}/>,
    document.getElementById('root')
);

registerServiceWorker();
