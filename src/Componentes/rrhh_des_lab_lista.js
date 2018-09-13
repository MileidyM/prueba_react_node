import React, {Component} from 'react';

import '../dist/css/bootstrap.min.css';
import '../css/form-validation.css';
import '../font-awesome/css/font-awesome.min.css';
import '../css/estiloscss.css';
import '../css/dataTables.bootstrap4.min.css';
//import '../rrhh_des_lab_reporte';
//import '../rrhh_des_lab_lista';

import {Link} from "react-router";
import axios from "axios";

const $ = require('jquery');
$.datatable = require('datatables.net-bs4');

class rrhh_des_lab_lista extends Component {


    state = {
        evaluations: []
    };

    componentDidUpdate() {
        $("#tbl_evaluaciones").DataTable();
    }

    componentDidMount() {

        const instance = axios.create({
            baseURL: 'https://4wxnkg0jqi.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 5000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });

        instance.get("/rrhh/evaluations")
            .then(res => {
                console.log(res.data.content.evaluations)
                const evaluations = res.data.content.evaluations;
                this.setState({evaluations});
            });

        console.log('El componente está disponible en el DOM');

    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12 mb-4">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">Lista de evaluaciones</h3>
                        </div>

                        <div className="box-body">
                            <table id="tbl_evaluaciones" className="table table-hover table-bordered">
                                <thead>
                                <tr>
                                    <th scope="col">Año</th>
                                    <th scope="col">Mes</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col" className="text-center"><i className="fa fa-gear"></i>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>

                                {this.state.evaluations.map(evaluated =>

                                    <tr key={evaluated.num_eval_id}>
                                        <td>{evaluated.str_eval_name.substr(0, 4)}</td>
                                        <td>{evaluated.str_eval_name.substr(5)}</td>
                                        <td>
                                            {evaluated.chr_status === "O" &&
                                            <span className="badge badge-primary">OPEN</span>
                                            }

                                            {evaluated.chr_status === "C" &&
                                            <span className="badge badge-primary">CLOSE</span>
                                            }
                                            
                                        </td>

                                        <td className="text-center">
                                            <Link className="btn btn-primary btn-sm" to={"/recursosdefinidos/"+evaluated.num_eval_id}><i className="fa fa-pencil"></i></Link> 
                                            <Link className="btn btn-secondary btn-sm" to={"/recursosreporte/"+evaluated.num_eval_id}><i className="fa fa-bar-chart"></i></Link> 
                                            <button type="button" className="btn btn-warning btn-sm btn-lock"><i
                                                className="fa fa-lock"></i>
                                            </button>

                                        </td>

                                    </tr>
                                )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default rrhh_des_lab_lista;