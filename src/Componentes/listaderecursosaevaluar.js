import React, {Component} from 'react';

import '../dist/css/dataTables.bootstrap4.min.css';

import {Link} from "react-router";
import axios from "axios";
import defphoto from '../img/user-icon.jpg';
import Knob from 'react-canvas-knob';

const $ = require('jquery');
$.datatable = require('datatables.net-bs4');

class prueba extends Component {

    state = {
        supervisions: [],
        usuario: null
    };

    knobChange = (newValue) => {
        this.setState({value: newValue});
    };
    
    componentDidMount() {

        this.state.usuario = JSON.parse(sessionStorage.getItem('user_data'));

        const instance = axios.create({
            baseURL: 'https://pbndb4oln4.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 5000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });

        instance.get("/rrhh/supervisions?str_employee_super_id=" + this.state.usuario['cod_empleado'])
            .then(res => {
                console.log(res.data.content.supervisions);
                const supervisions = res.data.content.supervisions;
                this.setState({supervisions});
            });

        console.log('El componente está disponible en el DOM');

        

        /**var k = knob({
            className: "dial",
            value:50,
            angleOffset: -125,
            angleArc: 250,
            min: 0,
            max: 200,
            width: 100
        });
         $("body").append(k);**/
    }
    componentDidUpdate() {
        $("#tbl_evaluados").DataTable();
    }
    render() {
        return (
            <div className="row">

                <div className="col-md-12 mb-4">

                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">Lista de personas a evaluar</h3>
                        </div>


                        <div className="box-body">
                            <p>Seleccione una persona para empezar a evaluar</p>


                            <table id="tbl_evaluados" className="table table-bordered" width="100%">

                                <thead>
                                <tr>
                                    <th scope="col" width="5%">#</th>
                                    <th scope="col" width="15%">Nombres</th>
                                    <th scope="col" width="15%">Apellidos</th>
                                    <th scope="col" className="text-center" width="15%">Estado</th>
                                    <th scope="col" className="text-center" width="25%">Nota</th>
                                    <th scope="col" className="text-center" width="30%">Comentario</th>
                                </tr>
                                </thead>
                                <tbody>

                                {this.state.supervisions.map(evaluated =>
                                    <tr key={evaluated.num_supervision_id}>
                                        <td className="align-middle text-center">
                                            <img data-src="holder.js/45x45" height={75} className="rounded" alt="75x75"
                                                 src={evaluated.str_photo ? evaluated.str_photo : defphoto} data-holder-rendered="true"/>
                                        </td>
                                        <td className="align-middle">
                                            {evaluated.chr_status === "SE" &&
                                                    <Link className="btn-link" to={"/empleado/"+evaluated.num_supervision_id} >{evaluated.str_person_name}</Link>
                                            }
                                            {evaluated.chr_status === "E " &&
                                                    <span>{evaluated.str_person_name}</span>
                                            }
                                        </td>
                                        <td className="align-middle">
                                            {evaluated.str_last_name_dad} {evaluated.str_last_name_mom}
                                        </td>
                                        <td className="align-middle text-center">
                                            {evaluated.chr_status === "SE" &&
                                                <span>SIN EVALUAR</span>
                                            }
                                            {evaluated.chr_status === "E " &&
                                            <span>EVALUADO</span>
                                            }
                                        </td>
                                        <td className="align-middle text-center">
                                            <Knob
                                                className="dial" width={75}  height={75}
                                                fgColor="#28a745" skin="tron"
                                                onChange={this.knobChange}
                                                thickness={0.2} value={Math.round(evaluated.num_total_score)} />
                                        </td>
                                        <td className="align-middle">

                                            {evaluated.str_comment.trim() === "" &&
                                            <span>Sin Comentarios ....</span>
                                            }
                                            {evaluated.str_comment.trim() !== "" &&
                                            <span>{evaluated.str_comment}</span>
                                            }

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
export default prueba;