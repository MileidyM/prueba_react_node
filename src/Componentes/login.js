import React, {Component} from 'react';
import logo from '../img/user2-160x160.jpg';

import '../dist/css/bootstrap.min.css';
import '../css/form-validation.css';
import '../font-awesome/css/font-awesome.min.css';
import '../css/estiloscss.css';
import {browserHistory} from 'react-router'

import $ from 'jquery';
import axios from "axios";

class Login extends Component {
    componentDidMount() {
        $("input.data-eye[type='password']").each(function (i) {
            let $this = $(this);

            $this.wrap($("<div/>", {
                style: 'position:relative'
            }));
            $this.css({
                paddingRight: 60
            });
            $this.after($("<div/>", {
                html: 'Show',
                class: 'btn btn-primary btn-sm',
                id: 'passeye-toggle-' + i,
                style: 'position:absolute;right:10px;top:50%;transform:translate(0,-50%);padding: 2px 7px;font-size:12px;cursor:pointer;'
            }));
            $this.after($("<input/>", {
                type: 'hidden',
                id: 'passeye-' + i
            }));
            $this.on("keyup paste", function () {
                $("#passeye-" + i).val($(this).val());
            });
            $("#passeye-toggle-" + i).on("click", function () {
                if ($this.hasClass("show")) {
                    $this.attr('type', 'password');
                    $this.removeClass("show");
                    $(this).removeClass("btn-outline-primary");
                } else {
                    $this.attr('type', 'text');
                    $this.val($("#passeye-" + i).val());
                    $this.addClass("show");
                    $(this).addClass("btn-outline-primary");
                }
            });
        });

        console.log("user_data ==> " + sessionStorage.getItem('user_data'));
    }

    handleSubmit = event => {
        event.preventDefault();
        const request = {

            "username": $('#email').val(),
            "password": $('#password').val()

        };

        ///ver la manera de manejartodo estoo en Axios
        const instance = axios.create({
            baseURL: 'https://678qymr0y7.execute-api.us-east-1.amazonaws.com/PRODENV',
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic TVNfTE9HSU46VkYkQ09OU1VMVElOR19MT0dJTg=='
            },
            withCredentials: false,
            auth: {
                username: 'MS_LOGIN',
                password: 'VF$CONSULTING_LOGIN'
            }
        });

        instance.post('/Sigap/login', request)
            .then(res => {

                if (res.data.usuario != null) {
                    console.log(res.data.usuario);

                    sessionStorage.setItem('user_data', JSON.stringify(res.data.usuario));

                    console.log(sessionStorage.getItem('user_data'));

                    browserHistory.push("/main");
                } else {
                    alert("Credenciales no validas")
                }

            });
    };

    render() {
        return (
            <div className="my-login-page">
                <section className="h-100">
                    <div className="container h-100">
                        <div className="row justify-content-md-center h-100">
                            <div className="card-wrapper">
                                <div className="brand">
                                    <img src={logo}/>
                                </div>
                                <div className="card fat">
                                    <div className="card-body">
                                        <h4 className="card-title">Login</h4>
                                        <form onSubmit={this.handleSubmit}>

                                            <div className="form-group">
                                                <label for="email">E-Mail Address</label>

                                                <input id="email" type="email" className="form-control" required/>
                                            </div>

                                            <div className="form-group">
                                                <label for="password">Password

                                                    {/*
                                                    <a href="forgot.html" className="float-right">
                                                        Forgot Password?
                                                    </a>
                                                     */}

                                                </label>
                                                <input id="password" type="password" className="form-control data-eye"
                                                       name="password" required/>
                                            </div>
                                            {/*
                                            <div className="form-group">
                                                <label>
                                                    <input type="checkbox" name="remember"/> Remember Me
                                                </label>
                                            </div>
                                             */}
                                            <div className="form-group no-margin">
                                                <button type="submit" className="btn btn-primary btn-block">
                                                    Login
                                                </button>
                                            </div>
                                            {/*
                                            <div className="margin-top20 text-center">
                                                Don't have an account? <a href="register.html">Create One</a>
                                            </div>
                                            */}
                                        </form>
                                    </div>
                                </div>
                                <div className="footer">
                                    Copyright &copy; VF CONSULTING S.A.C. 2018
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Login;