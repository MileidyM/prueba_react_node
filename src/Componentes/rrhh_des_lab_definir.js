import React, {Component} from 'react';
import '../dist/css/bootstrap.min.css';
import '../css/form-validation.css';
import '../font-awesome/css/font-awesome.min.css';
import '../css/estiloscss.css';
import '../css/dataTables.bootstrap4.min.css';
import axios from "axios";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import defphoto from '../img/user-icon.jpg';


const $ = require('jquery');
$.datatable = require('datatables.net-bs4');

class rrhh_des_lab_definir extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            employees: [],
            employees_choose: [],
            supervisions: [],
            employee_selected: "",
            num_eval_id: this.props.params.id,
        };
        this.remove = this.remove.bind(this);
        this.addSupervisor = this.addSupervisor.bind(this);
        this.toggle = this.toggle.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.isSupervisor = this.isSupervisor.bind(this);
        this.instanceEmp = axios.create({
            baseURL: 'https://hcqc70nme7.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 10000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });

        this.instanceSup = axios.create({
            baseURL: 'https://pbndb4oln4.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 10000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });
    }

    getSelected() {
        return this.state.employee_selected;
    }

    remove(num_supervision_id) {
        console.log(num_supervision_id);
        console.log(this);
        //var obj = this;

        this.instanceSup.delete("/rrhh/supervisions/" + num_supervision_id)
            .then(res => {
                console.log(res.data);
                this.setState({
                    supervisions: this.state.supervisions.filter((el) => num_supervision_id !== el.num_supervision_id)
                })
            });
    }

    addSupervisor() {
        var str_employee_id = this.state.employee_selected;
        console.log(str_employee_id);

        var oTable = $('#tbl_supervisor').dataTable();
        var rowcollection = oTable.$("[name='check-supervisor']:checked", {"page": "all"});
        var supervisions = [];
        var num_eval_id = this.state.num_eval_id;
        rowcollection.each(function (index, elem) {
            var sup_selected = $(elem).val();
            console.log(sup_selected);
            var emp = {};
            emp.str_employee_super_id = sup_selected;
            emp.str_employee_eval_id = str_employee_id;
            emp.num_total_score = 0;
            emp.str_comment = "";
            emp.chr_status = "SE";
            emp.str_createdby = "dllanos";
            emp.num_eval_id = num_eval_id;
            supervisions.push(emp);
        });

        const request = {
            "supervisions": supervisions

        };

        this.instanceSup.post("/rrhh/supervisions", request
        )
            .then(res => {
                this.toggle(null);
                this.instanceSup.get("/rrhh/supervisions?num_eval_id="+this.state.num_eval_id)
                    .then(res => {
                        console.log(res.data.content.supervisions)
                        const supervisions = res.data.content.supervisions;
                        this.setState({supervisions});
                    });
            }).catch(function (error) {
            console.log(error);
        });

    }

    isSupervisor(str_employee_id,str_employee_super_id){
        return  true;
    }

    toggle(str_employee_id) {
        if(!this.state.modal){
            //this.state.employees_choose = this.state.employees;
            //this.state.supervisions.filter(supervision => supervision.str_employee_eval_id is not in (employee.str_employee_id).map(supervision =>
            console.log("toggle: get emp");
            const supervisor_emp=this.state.supervisions.filter(supervision => supervision.str_employee_eval_id===str_employee_id);
              //  );
              console.log(supervisor_emp);
            this.state.employees_choose = this.state.employees.filter(emp => 
                supervisor_emp.filter(supervision => supervision.str_employee_super_id === emp.str_employee_id).length === 0
            );
            //this.state.employees_choose = this.state.employees_choose.filter(emp => emp.str_employee_id !== employee.str_employee_id)
            //((el) => num_supervision_id !== el.num_supervision_id)
        }
        this.setState({
            modal: !this.state.modal,
            employee_selected: str_employee_id,
        });
        
    }

    componentDidUpdate() {
        $("#tbl_supervisor").DataTable();
    }

    componentDidMount() {


        this.instanceEmp.get("/rrhh/employees?chr_status=A")
            .then(res => {
                console.log(res.data.content.employees)
                const employees = res.data.content.employees;
                this.setState({employees});
                $("#tbl_def_supervisores").DataTable();
            });

        this.instanceSup.get("/rrhh/supervisions?num_eval_id="+this.state.num_eval_id)
            .then(res => {
                console.log(res.data.content.supervisions)
                const supervisions = res.data.content.supervisions;
                this.setState({supervisions});
            });
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Definir Supervisores</h3>
                            </div>

                            <div className="box-body">
                                <p>Seleccione los supervisores para cada persona</p>
                                <table id="tbl_def_supervisores" className="table table-hover table-bordered">
                                    <thead>
                                    <tr>
                                        <th scope="col" width="10%">#</th>
                                        <th scope="col" width="30%">Evaluado</th>
                                        <th scope="col" width="60%">Supervisor</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.employees.map(employee =>
                                        <tr key={employee.str_employee_id}>
                                            <td align="center"><img data-src="holder.js/45x45" height={45}
                                                                 className="rounded" alt="75x75"
                                                                 src={employee.str_photo ? employee.str_photo : defphoto} data-holder-rendered="true"/>
                                            </td>
                                            <td className="align-middle">{employee.str_person_name} {employee.str_last_name_dad}</td>
                                            <td className="align-middle">
                                                <div className="d-flex">
                                                    <div className="w-100">
                                                        {this.state.supervisions.filter(supervision => supervision.str_employee_eval_id === employee.str_employee_id).map(supervision =>
                                                            <div key={supervision.num_supervision_id} className="chip">
                                                                <img data-src="holder.js/35x35"
                                                                     src={supervision.str_photo_sup ? supervision.str_photo_sup : defphoto}
                                                                     alt="Person" width={45} height={45}/>
                                                                {supervision.str_employee_super_id}
                                                                <span className="closebtn"
                                                                      onClick={this.remove.bind(this, supervision.num_supervision_id)}>&times;</span>
                                                            </div>
                                                        )}

                                                    </div>
                                                    <div className="flex-shrink-1 align-middle">
                                                        <button type="button"
                                                                className="btn btn-primary btn-sm pull-right"
                                                                onClick={this.toggle.bind(this, employee.str_employee_id)}>
                                                            <i className="fa fa-plus"></i></button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Asignar supervisores</ModalHeader>
                    <ModalBody>
                        <table id="tbl_supervisor" className="table table-hover">
                            <thead>
                            <tr>
                                <th><i className="fa fa-check"></i></th>
                                <th>Supervisores</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.employees_choose.map(employee =>
                                <tr key={employee.str_employee_id}>
                                    <td>
                                        <div className="form-check">
                                            <input name="check-supervisor" className="form-check-input position-static"
                                                   type="checkbox" id="blankCheckbox" value={employee.str_employee_id}
                                                   aria-label="..."/>
                                        </div>
                                    </td>
                                    <td>{employee.str_person_name} {employee.str_last_name_dad} {employee.str_last_name_mom}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addSupervisor}>Asignar</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                    </ModalFooter>
                </Modal>

            </React.Fragment>

        );
    }
}

export default rrhh_des_lab_definir;