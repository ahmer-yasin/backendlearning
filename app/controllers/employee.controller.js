/**
 * Created by Codenvoi
 * website: http://www.codenvoi.com
 */
var Employee = require("../models/employee.modal")
var mongoose = require("mongoose");
var joi = require("joi");
var helper = require("../helpers");

module.exports={
    create : function (req,res) {
        console.log("body", req.body);

        var data = req.body;
        var validate = helper.validateSignUp(data)
        if(validate.error){
            return res.send({
                message : validate.error.message,
                success : false
            })
        }
        else{
            var employeeId = mongoose.Types.ObjectId();
            var employee = new Employee({
                _id: employeeId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                salary: req.body.salary,
                gender: req.body.gender,
                email: req.body.email
            });

            employee.save(function (err,employee) {
                if(err){
                    return next(err);
                }
                else{
                    res.send({
                        code : 200,
                        message : "Successfully added new employee",
                        date : employee
                    })
                }
            })
        }
        //     if(fields == "email"){
        //         var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        //         if((typeof (data[fields]) != "string") || !pattern.test(data[fields])){
        //             return res.send({
        //                 code : 404,
        //                 message: "invalid mail"
        //             })
        //         }
        //     }
        //
        // }

    },

    read : function (req,res) {
        console.log("Read ki request");
        Employee.find({}, function (err, employees) {
            if(err){
                return next(err)
            }
            else{
                res.send({
                    code:200,
                    success:true,
                    data : employees
                })
            }
        });
    },

    login : function (req,res) {
        console.log("Login ki request", req.body);
        var data = req.body;

        var validate = helper.validateLogin(data);

        if(validate.error){
            return res.send({
                succeess : false,
                message : validate.error.message
            })
        }
        else{
            Employee.findOne({ $and: [
                {salary : req.body.salary},
                {firstName : req.body.firstName}
            ]
            } ,function (err,emp) {
                if(err || !emp){
                    return res.send({
                        code : 404,
                        message : "user not found in DB"
                    })
                }
                else{
                    res.send({
                        data: emp,
                        code : 200,
                        message : "success"
                    })
                }
            })
        }
    }
}

