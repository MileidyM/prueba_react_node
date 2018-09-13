import React, {Component} from 'react';


import '../dist/css/bootstrap.min.css';
import '../css/form-validation.css';
import '../font-awesome/css/font-awesome.min.css';
import '../css/estiloscss.css';
import '../css/dataTables.bootstrap4.min.css';

//import {prueba} from './listaderecursosaevaluar';
import $ from 'jquery';

import {browserHistory, Link} from 'react-router';

class App extends Component {

    state = {
        usuario: null
    };
    constructor() {
        super();
        if (JSON.parse(sessionStorage.getItem('user_data')) == null) {
            browserHistory.push("/");
        } else {
            this.state.usuario = JSON.parse(sessionStorage.getItem('user_data'));
            console.log("user_data ==> " + Object.values(this.state.usuario));
        }

    }

    componentDidMount() {

        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
            $(this).toggleClass('active');
        });


        const modulos = this.state.usuario['modulos'];
        console.log(modulos);

        for (const m in modulos) {
            console.log(modulos[m]['vch_nom_modulo']);
            if (modulos[m]['vch_nom_modulo'] === 'EVALUACION') {
                console.log(modulos[m]['vch_nom_modulo']);
                $('#evaluar').show();
            }
            if (modulos[m]['vch_nom_modulo'] === 'GESTION DE EVALUACION') {
                console.log(modulos[m]['vch_nom_modulo']);
                $('#gestionar').show();
            }

        }

    }

    log_out() {
        sessionStorage.clear();
        browserHistory.push("/");
    }

    render() {

        return (
            <div className="wrapper">
                <nav id="sidebar">

                    <div className="sidebar-header">
                        <span><b>ZE</b>US</span>
                    </div>

                    <div className="user-panel">
                        <div className="pull-left image">
                            <img src={this.state.usuario['foto']} className="rounded-circle" alt="User Image"/>
                        </div>


                        <div className="pull-left info">
                            <p>{this.state.usuario['nombre']}</p>
                            <a href="#"><i className="fa fa-circle text-success"/> Online</a>
                        </div>
                    </div>

                    <div className="header">OPCIONES</div>

                    <ul className="list-unstyled components">

                        <li className="active">

                            <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="true"
                               className="dropdown-toggle">Desempeño laboral</a>
                            <ul className="list-unstyled collapse show" id="homeSubmenu">


                                <li id="gestionar" style = {{display: 'none'}}>
                                    <Link to="/listaDeRecursos" activeClassName="is-active"><i
                                        className="fa fa-circle-o"
                                        />Gestionar</Link>
                                </li>


                                <li id="evaluar" style = {{display: 'none'}}>
                                    <Link to="/listaderecursosaevaluar"><i
                                        className="fa fa-circle-o"/> Evaluar</Link>
                                </li>

                            </ul>
                        </li>
                    </ul>
                </nav>
                <div id="content" className="p-0">
                    <nav className="navbar navbar-expand-lg navbar-main">
                        <div className="container-fluid">
                            <button type="button" id="sidebarCollapse" className="navbar-btn">
                                <span/>
                                <span/>
                                <span/>
                            </button>
                            <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button"
                                    data-toggle="collapse" data-target="#navbarSupportedContent"
                                    aria-controls="navbarSupportedContent" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                <i className="fas fa-align-justify"/>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="nav navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <a className="nav-link" href="#" onClick={this.log_out}>Cerrar sesión</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <section className="content-header">
                        <h1>
                            Desempeño laboral
                            <small>Evaluar</small>
                        </h1>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><i className="fa fa-list-alt"/>Desempeño laboral</li>
                            <li className="breadcrumb-item active">Evaluar</li>
                        </ol>
                    </section>

                    <section className="content">
                        {this.props.children}
                        <footer className="my-5 pt-5 text-muted text-center text-small">
                            <p className="mb-1">&copy; 2017-2018 VF CONSULTING</p>
                        </footer>
                    </section>
                </div>
                <div>
                </div>
            </div>
        );

    }
}

export default App;