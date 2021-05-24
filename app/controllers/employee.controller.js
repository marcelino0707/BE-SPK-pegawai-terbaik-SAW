
const { Employee } = require('../models')
const { Op } = require("sequelize")
const ValidationError  = require("sequelize").ValidationError;
const _ = require('lodash')

//Post
const employeePost = async(req,res)=> {
    const {nama_pegawai, nik} = req.body 
     
    // const data = await Employee.findOne({where: { nik : nik }})
    try{
        // if(data === null)
        // {
            const employee = await Employee.create({nama_pegawai, nik})
            return res.status(200).json(employee)
        // }
        // return res.status(400).json('nik : Employees are already registered using the nik') 
    } catch(e){
        // console.log(e.errors)
        const messages = {}

        //CATCH ERROR VALIDATE FROM SEQUELIZE
        if (e instanceof ValidationError) {

            //LOOPING
            e.errors.forEach((error) => {

                // let message
                // //SWITCH
                // console.log(error)
                // switch (error.validatorKey) {
                //     case 'notEmpty':
                //         message = error.message
                //         break
                //     case 'isInt':
                //         message = error.message
                //         break
                //     case 'not_unique':
                //         message = error.message
                //         break
                // }
                // error.path = error.path.replace("_UNIQUE", "");

                messages[error.path] = error.message;
               
            });
        }
        
        // return res.status(400).json({error : e.errors})
        return res.status(400).json(messages)
    }
}

//GetAll
const employeeGetAll = async (req,res) => {
    try{
        let {search, page} = req.query
        let current_page = page
        let per_page = 10
        let show_page = (page - 1) * per_page

        if(search){
            let find = await Employee.findAndCountAll(
                {
                    where: { nama_pegawai : {[Op.like] : `%${search}%`} }, 
                    limit: per_page,
                    offset: show_page
                }
            )
            return res.status(200).json({data : {current_page, data : find.rows, total: find.count, per_page }})
        }else{
            let employees = await Employee.findAndCountAll(
                { 
                    limit: per_page,
                    offset: show_page
                }
            )
            return res.status(200).json({data : {current_page, data : employees.rows, total: employees.count, per_page }})
            
        }
    }catch (err){
        return res.status(500).json({ error: 'Something went wrong'})
    }
}

//Find by id
const employeeFindOne = async (req,res) => {
    const id = req.params.id
    try{
        const employee = await Employee.findOne({
            where: { id }
        })
        return res.json(employee)
    }catch (err){
        return res.status(500).json({ error: 'Something went wrong'})
    }
}

//Delete
const employeeDelete = async (req,res) => {
    const id = req.params.id
    try{
        const employee = await Employee.findOne({where: { id } })

        await employee.destroy()

        return res.json({ message: 'Pegawai telah dihapus'})
    }catch (err){
        return res.status(500).json({ error: 'Something went wrong'})
    }
}

//EDIT
const employeeUpdate = async (req,res) => {
    const id = req.params.id
    const { nama_pegawai, nik} = req.body
    try{
        
        const employee = await Employee.findOne({where: { id }})
        const data = await Employee.findOne({where: { nik : nik }})

        if(employee === null){
            return res.status(400).json('message : Employees have not been registered')
        }else{
            const messages = {}
            let validatorNamaPegawai = 'nama_pegawai'
            let validatorNik = 'nik'

            if(_.isEmpty(nama_pegawai)){
                messages[validatorNamaPegawai] = 'Nama pegawai tidak boleh kosong';
            }

            if(_.isEmpty(nik)){
                messages[validatorNik] = 'NIK tidak boleh kosong'
            }

            if(!(data === null || data.nik === employee.nik)){
                messages[validatorNik] = 'NIK telah terdaftar oleh pegawai lain'
            }
            
            
            if(!(data === null || data.nik === employee.nik) || _.isEmpty(nama_pegawai) || _.isEmpty(nik)){
                return res.status(400).json(messages)
            }
            else {
                employee.nama_pegawai = nama_pegawai
                employee.nik = nik
                
                await employee.save()
                
                return res.status(200).json(employee)
            }
        }
        
    }catch (err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong'})
    }
} 


module.exports = {employeePost,employeeGetAll,employeeFindOne,employeeDelete,employeeUpdate}

