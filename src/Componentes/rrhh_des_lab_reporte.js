import React, {Component} from 'react';
import '../dist/css/bootstrap.min.css';
import '../css/form-validation.css';
import '../font-awesome/css/font-awesome.min.css';
import '../css/estiloscss.css';
import '../css/dataTables.bootstrap4.min.css';
import defphoto from '../img/user-icon.jpg';
import Knob from 'react-canvas-knob';
import axios from "axios";
import 'datatables.net-bs4'
import 'datatables.net-buttons'
import 'datatables.net-buttons-bs4'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

var $ = require('jquery');
//var dt = require('datatables.net');
//var buttons = require( 'datatables.net-buttons' );

pdfMake.vfs = pdfFonts.pdfMake.vfs;
//var html5btn = require('datatables.net-buttons/js/buttons.html5.js');


class rrhh_des_lab_reporte extends Component {

    constructor(props) {
        super(props);
        this.state = {
            num_eval_id: this.props.params.id,
            evaluations: []
        };
    }

    componentDidMount() {

        const instance = axios.create({
            baseURL: 'https://4oi1bretrf.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 5000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });

        instance.get("/rrhh/reports?num_eval_id=" + this.state.num_eval_id)
            .then(res => {
                const evaluations = res.data.content.report;
                this.setState({evaluations});

                $('#tbl_evaluados').DataTable({
                    dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                    buttons: [{extend: 'pdf'}]
                });
            });
    }

    knobChange = (newValue) => {
        this.setState({value: newValue});
    };


    render() {
        return (

            <div className="row">
                <div className="col-md-12 mb-4">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">Reporte de evaluación de desempeño</h3>
                        </div>

                        <div className="box-body">
                            <p>Muestra el puntaje obtenido en la evaluación "NOMBRE DE EVALUACIÓN"</p>
                            <table id="tbl_evaluados" className="table table-bordered" width="100%">
                                <thead>
                                <tr>
                                    <th scope="col" width="5%"/>
                                    <th scope="col" width="30%">Nombres y Apellidos</th>
                                    <th scope="col" className="text-center" width="10%">Nota</th>
                                    <th scope="col" className="text-center" width="25%">Resultado</th>
                                    <th scope="col" width="30%">Evaluadores</th>
                                </tr>
                                </thead>
                                <tbody>


                                {this.state.evaluations.map(evaluated =>

                                    <tr key={evaluated.str_employee_id}>
                                        <th className="align-middle text-center" scope="row">
                                            <img data-src="holder.js/45x45" className="rounded" alt="75x75"
                                                 style={{width: 45, height: 45}}
                                                 src={evaluated.str_photo ? evaluated.str_photo : defphoto}
                                                 data-holder-rendered="true"/>
                                        </th>

                                        <td className="align-middle">{evaluated.str_person_name} {evaluated.str_last_name_dad}</td>
                                        <td className="align-middle text-center">
                                            <Knob
                                                className="dial" width={75} height={75}
                                                fgColor="#28a745" skin="tron"
                                                onChange={this.knobChange}
                                                thickness={0.2} value={Math.round(evaluated.avg_score)}/>
                                            <span className="d-none"> {Math.round(evaluated.avg_score)} </span>
                                        </td>
                                        <td className="align-middle text-center">
                                            {Math.round(evaluated.avg_score) <= 100.0 &&
                                            Math.round(evaluated.avg_score) >= 91.0 &&
                                            <span >Supera ampliamente las expectativas</span>
                                            }

                                            {Math.round(evaluated.avg_score) <= 90.0 &&
                                            Math.round(evaluated.avg_score) >= 81.0 &&
                                            <span >Excede parcialmente las expectativas</span>
                                            }

                                            {Math.round(evaluated.avg_score) <= 80.0 &&
                                            Math.round(evaluated.avg_score) >= 61.0 &&
                                            <span >Cumple las expectativas</span>
                                            }

                                            {Math.round(evaluated.avg_score) <= 60.0 &&
                                            Math.round(evaluated.avg_score) >= 41.0 &&
                                            <span>Cumple parcialmente las expectativas</span>
                                            }

                                            {Math.round(evaluated.avg_score) <= 40.0 &&
                                            Math.round(evaluated.avg_score) >= 0.0 &&
                                            <span>No cumple las expectativas</span>
                                            }

                                        </td>
                                        <td className="align-middle">
                                            {evaluated.supers.map(sup =>
                                                <div key={sup.str_employee_super_id}>
                                                    <div className="progress">
                                                        <div className="progress-bar bg-success" role="progressbar"
                                                             style={{width: Math.round(sup.num_total_score) + "%"}}
                                                             aria-valuenow={Math.round(sup.num_total_score)}
                                                             aria-valuemin="0"
                                                             aria-valuemax="100">{Math.round(sup.num_total_score)}%
                                                        </div>
                                                    </div>
                                                    <small>{" " + sup.str_person_name} {sup.str_last_name_dad}</small>
                                                    {"\n"}
                                                </div>
                                            )}
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


export default rrhh_des_lab_reporte;