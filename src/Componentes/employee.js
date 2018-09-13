import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import '../dist/css/bootstrap.min.css';
import '../css/form-validation.css';
import '../font-awesome/css/font-awesome.min.css';
import '../css/estiloscss.css';
import '../css/dataTables.bootstrap4.min.css';
import axios from "axios";

const $ = require('jquery');

class employee extends Component {

    state = {
        num_supervision_id: this.props.params.id,
        questions: [],
        attributes: [],
        qs: [],
        usuario: null
    };

    constructor(props) {
        super(props);

        this.redirectToMain = this.redirectToMain.bind(this);
        this.state.usuario = JSON.parse(sessionStorage.getItem('user_data'));
    }

    handleChange = event => {
        //aqui captura los valores que estan en el formulario xd
        this.setState({str_eval_name: event.target.value});
    };

    componentDidMount() {

        const instance = axios.create({
            baseURL: 'https://2enjvij884.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 5000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });

        instance.get("/rrhh/questions")
            .then(res => {
                const questions = res.data.content.questions;
                this.setState({questions});
            });


        const instance2 = axios.create({
            baseURL: 'https://q7nc8lmfeb.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 5000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });

        instance2.get("/zeus/attributes?str_attribute_name=scores")
            .then(res => {
                const attributes = res.data.content.attributes;
                this.setState({attributes});
            });
    }

    redirectToMain = (data) => {
        console.log("change history");
        browserHistory.push('/listaderecursosaevaluar');
    };

    handleSubmit = event => {
        event.preventDefault();
        const answers = [];
        const num_supervision_id = this.state.num_supervision_id;
        let cont = 0;
        $("input[name*='question-']:checked").each(function (index, elem) {
            var name = $(this).attr("name");
            var num_question_id = name.split("-")[1];
            var num_score_evaluation = $(this).val();
            cont = cont + parseInt(num_score_evaluation);
            var answer = {};
            answer.num_question_id = num_question_id;
            answer.num_score_evaluation = num_score_evaluation;
            answer.num_supervision_id = num_supervision_id;
            answers.push(answer);

            //Do something with 'checkbox_value'
        });


        const request = {
            "answers": answers
        };


        const instance3 = axios.create({
            baseURL: 'https://0698bz17kd.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 5000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });

        const instance4 = axios.create({
            baseURL: 'https://pbndb4oln4.execute-api.us-east-1.amazonaws.com/dev',
            timeout: 5000,
            headers: {'Content-Type': 'application/json'},
            withCredentials: false,
            auth: {
                username: 'diana',
                password: 'Diana'
            }
        });

        instance3.post("/rrhh/answers", request)
            .then(res => {


                if (res.data.status === 200) {

                    console.log("se realizo el insert");
                    console.log("Contador --> " + cont);
                    console.log("respuestas --> " + answers.length);
                    console.log("opciones --> " + this.state.attributes.length);
                    console.log("puntaje --> " + (cont / (answers.length * this.state.attributes.length)) * 100);

                    const supervision = {
                        'num_total_score': (cont / (answers.length * this.state.attributes.length)) * 100,
                        'str_comment': $('#comment').val(),
                        'chr_status': "E",
                        'str_modifiedby': this.state.usuario['cod_empleado']

                    };

                    const request2 = {
                        "supervision": supervision
                    };

                    instance4.put("/rrhh/supervisions/" + num_supervision_id, request2)
                        .then(res => {
                            if (res.data.status === 200) {

                                this.redirectToMain();
                                console.log("se realizo la actualizacion");
                            }

                        });


                }

            });


    };


    render() {
        return (
            <div className="row">
                <div className="col-md-4 order-md-2 mb-4">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <h3 className="box-title">Resultado</h3>
                            <div className="box-tools pull-right">
                                <button className="btn btn-box-tool" type="button" data-widget="collapse"><i
                                    className="fa fa-minus"/>
                                </button>
                            </div>

                        </div>

                        <div className="box-body">
                            <ul className="list-indicator list-group mb-3">

                                {this.state.attributes.map(attribute =>
                                    <li key={attribute.str_attr_member_value}
                                        className="list-group-item d-flex justify-content-between lh-condensed">
                                        <div>
                                            <h6 className="my-0 text-success">{attribute.str_attr_member_value}</h6>
                                            <small className="text-muted">{attribute.str_attr_member_desc}</small>
                                        </div>
                                        <span className="text-muted">{attribute.str_attr_member_desc_2}</span>
                                    </li>
                                )}

                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-8 order-md-1">
                    <form onSubmit={this.handleSubmit}>
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Desempeño en base a competencias</h3>
                                <div className="box-tools pull-right">
                                    <button className="btn btn-box-tool" type="button" data-widget="collapse">
                                        <i className="fa fa-minus"/>
                                    </button>
                                </div>
                            </div>
                            <div className="box-body">
                                {this.state.questions.map(question =>
                                    <div key={question.str_type}>
                                        <h6 className="text-muted">{question.str_type}</h6>

                                        <ul className="list-group mb-3">


                                            {question.qs.map(q =>
                                                <li key={q.num_question_id} className="list-group-item">
                                                    <div className="">
                                                        {q.str_name}
                                                        <br></br>
                                                        <br></br>
                                                        {this.state.attributes.map(attribute =>
                                                            <div key={attribute.str_attr_member_value}
                                                                 className="form-check form-check-inline">
                                                                <input className="form-check-input" type="radio"
                                                                       name={"question-" + q.num_question_id.toString()}
                                                                       id="inlineRadio1"
                                                                       value={attribute.str_attr_member_value.substr(7)}
                                                                        required={true}/>
                                                                <label className="form-check-label"
                                                                       htmlFor="inlineRadio1">{attribute.str_attr_member_value.substr(7)}</label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            )}
                                        </ul>

                                    </div>
                                )}

                                <h6 className="text-muted">Comentarios Adicionales</h6>
                                <div className="form-group">
                                <textarea className="form-control" name="num_score_evaluation" id="comment"
                                          rows="3" onChange={this.handleChange}/>
                                </div>

                            </div>

                            <div className="box-footer">
                                <button className="btn btn-primary btn-md pull-right" type="submit">Enviar resultados<i
                                    className="fa fa-arrow-circle-right"/></button>
                            </div>
                        </div>
                    </form>


                </div>


            </div>

        );
    }
}

export default employee;