import React from 'react';
import {Router, Route} from 'react-router';

import Login from '../Componentes/login';
import App from '../Componentes/app';
import rrhh_des_lab_lista from '../Componentes/rrhh_des_lab_lista';
import listaderecursosaevaluar from '../Componentes/listaderecursosaevaluar';
import empleado from '../Componentes/employee';
import recursosdefinidos from '../Componentes/rrhh_des_lab_definir';
import recursosreporte from '../Componentes/rrhh_des_lab_reporte';


const Routes = (props) => (
    <Router  {...props}>
        <Route path="/" component={Login}>
            <Route path="/" component={Login}/>
        </Route>
        <Route path="/main" component={App}>
            <Route path="/main" component={App}/>
            <Route path="/listaDeRecursos" component={rrhh_des_lab_lista}/>
            <Route path="/listaderecursosaevaluar" component={listaderecursosaevaluar}/>
            <Route path="/empleado/:id" component={empleado}/>
            <Route path="/recursosdefinidos/:id" component={recursosdefinidos}/>
            <Route path="/recursosreporte/:id" component={recursosreporte}/>

        </Route>
    </Router>
);

export default Routes;