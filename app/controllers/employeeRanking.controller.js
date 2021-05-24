const { Employee_ranking, Employee, Criterion, sequelize } = require('../models')
const _ = require('lodash')

//GetAll
const rankingGetAll = async (req,res) => {
    try{
        let {search, page, datepicker} = req.query
        let current_page = page
        let per_page = 10
        let show_page = (page - 1) * per_page
       
        let startDate= (_.isEmpty(datepicker) ? new Date("2021-04-12") : new Date(datepicker))
        let filterDate = startDate.getMonth() + 1
        let yearDate = startDate.getFullYear()
        // var fromMonth = (startDate.getMonth()+ 1) < 10 ? '0' + (startDate.getMonth()+1) : (startDate.getMonth()+1)
        
        // console.log(datepicker)
        if(search){
            const ranking = await Employee_ranking.findAndCountAll({
                
                attributes: [
                    'id','pegawai_id','nilai_kedisiplinan','nilai_kerjasama','nilai_inisiatif','nilai_kinerja','nilai_tanggungJawab','nilai_prestasi','total'
                ], 
                include: {model: Employee, attributes : ['nama_pegawai']},
                where : 
                    [
                        sequelize.where(sequelize.fn('LIKE', sequelize.col('Employee.nama_pegawai')), `%${search}%`),
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('Employee_ranking.created_at')), filterDate),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('Employee_ranking.created_at')), yearDate),
                        sequelize.where(sequelize.fn('NOT', sequelize.col('Employee.id')), null),
                        // sequelize.where(sequelize.col('Employee.deleted_at')),
                    ],
                
                order : sequelize.col('Employee_ranking.total'),

                limit: per_page,
                offset: show_page
            });
            
            return res.status(200).json({data : {current_page, data : ranking.rows, total: ranking.count, per_page}})
        }else{
            const ranking = await Employee_ranking.findAndCountAll({

                attributes: [
                    'id','pegawai_id','nilai_kedisiplinan','nilai_kerjasama','nilai_inisiatif','nilai_kinerja','nilai_tanggungJawab','nilai_prestasi','total'
                ], 
                include: {model: Employee, attributes : ['nama_pegawai']},
                where : 
                    [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('Employee_ranking.created_at')), filterDate),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('Employee_ranking.created_at')), yearDate),
                        sequelize.where(sequelize.fn('NOT', sequelize.col('Employee.id')), null),
                        // sequelize.where(sequelize.col('Employee.deleted_at')),
                    ],
                
                order : sequelize.col('Employee_ranking.total'),

                limit: per_page,
                offset: show_page
            });
            
            return res.status(200).json({data : {current_page, data : ranking.rows, total: ranking.count, per_page}})
        }
        

    
    }catch (err){
        return res.status(500).json({ error: 'Something went wrong'})
    }
}

//GetRankingEmployee
const rankingEmployee = async (req,res) => {
    try{
        
        const id = req.params.id
        let {datepicker} = req.query
        
        //date
        let startDate= (_.isEmpty(datepicker) ? new Date("2021-04-12") : new Date(datepicker))
        let filterDate = startDate.getFullYear()

        const ranking = await Employee_ranking.findAndCountAll({

            attributes: [
                'total', [sequelize.fn('MONTH', sequelize.col('Employee_ranking.created_at')),'month']
            ], 
            where : [
                    {pegawai_id : id},
                    // sequelize.where(sequelize.fn('MONTH', sequelize.col('Employee_ranking.created_at')), 4),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('Employee_ranking.created_at')), filterDate)
                ],
                
        });
        // console.log(ranking.rows[0].dataValues)

        // console.log(ranking.count)
        var dataset = []
        var i
        var j
        var check 
        for(i=0; i<12; i++)
        {
            check = i + 1
            if(_.isEmpty(dataset[i]))
            {
                for(j=0; j<ranking.count; j++)
                {
                    if(ranking.rows[j].dataValues.month === check )
                    {
                        // dataset.push({total : ranking.rows[j].dataValues.total, month : ranking.rows[j].dataValues.month})
                        dataset[i] = {total : ranking.rows[j].dataValues.total, month : ranking.rows[j].dataValues.month}
                        break
                    }else{
                        // dataset.push({total : 0, month : check})
                        dataset[i] = {total : 0, month : check}
                    }
                }
            }
        }
        // console.log(dataset)
        
        return res.status(200).json({data : { data : dataset }})

    }catch(error){
        return res.status(500).json({ error : error})
    }
}

//Post
const rankingPost = async(req,res)=> {
    const {
        pegawai_id, 
        nilai_kedisiplinan, 
        nilai_kerjasama, 
        nilai_inisiatif, 
        nilai_kinerja, 
        nilai_tanggungJawab,
        nilai_prestasi
    } = req.body 

    try{

        //----------------------------------------------------Create Object baru----------------------------------------------------
        const ranking = await Employee_ranking.create({
            pegawai_id, 
            nilai_kedisiplinan  , 
            nilai_kerjasama , 
            nilai_inisiatif , 
            nilai_kinerja , 
            nilai_tanggungJawab ,
            nilai_prestasi 
        })

        //-------------------------------------------------Cari Max tiap kriteria--------------------------------------------------

        //Bobot Max Kedisiplinan
        let max_kedisiplinan = await Employee_ranking.max('nilai_kedisiplinan')
        if(max_kedisiplinan <= 40){max_kedisiplinan = 2}
        if(max_kedisiplinan >= 41 && max_kedisiplinan <= 60 ){max_kedisiplinan = 3}
        if(max_kedisiplinan >= 61 && max_kedisiplinan <= 80 ){max_kedisiplinan = 4}
        if(max_kedisiplinan >= 81 && max_kedisiplinan <= 100 ){max_kedisiplinan = 5}

        //Bobot Max Kerjasama
        let max_kerjasama = await Employee_ranking.max('nilai_kerjasama')
        if(max_kerjasama <= 40){max_kerjasama = 2}
        if(max_kerjasama >= 41 && max_kerjasama <= 60 ){max_kerjasama = 3}
        if(max_kerjasama >= 61 && max_kerjasama <= 80 ){max_kerjasama = 4}
        if(max_kerjasama >= 81 && max_kerjasama <= 100 ){max_kerjasama = 5}

        //Bobot Max Inisiatif
        let max_inisiatif = await Employee_ranking.max('nilai_inisiatif')
        if(max_inisiatif <= 40){max_inisiatif = 2}
        if(max_inisiatif >= 41 && max_inisiatif <= 60 ){max_inisiatif = 3}
        if(max_inisiatif >= 61 && max_inisiatif <= 80 ){max_inisiatif = 4}
        if(max_inisiatif >= 81 && max_inisiatif <= 100 ){max_inisiatif = 5}
        
        //Bobot Max Kinerja
        let max_kinerja = await Employee_ranking.max('nilai_kinerja')
        if(max_kinerja <= 40){max_kinerja = 2}
        if(max_kinerja >= 41 && max_kinerja <= 60 ){max_kinerja = 3}
        if(max_kinerja >= 61 && max_kinerja <= 80 ){max_kinerja = 4}
        if(max_kinerja >= 81 && max_kinerja <= 100 ){max_kinerja = 5}

        //Bobot Max tanggung jawab
        let max_tanggungJawab = await Employee_ranking.max('nilai_tanggungJawab')
        if(max_tanggungJawab <= 40){max_tanggungJawab = 2}
        if(max_tanggungJawab >= 41 && max_tanggungJawab <= 60 ){max_tanggungJawab = 3}
        if(max_tanggungJawab >= 61 && max_tanggungJawab <= 80 ){max_tanggungJawab = 4}
        if(max_tanggungJawab >= 81 && max_tanggungJawab <= 100 ){max_tanggungJawab = 5}

        //Bobot Max prestasi
        let max_prestasi = await Employee_ranking.max('nilai_prestasi')
        if(max_prestasi <= 40){max_prestasi = 2}
        if(max_prestasi >= 41 && max_prestasi <= 60 ){max_prestasi = 3}
        if(max_prestasi >= 61 && max_prestasi <= 80 ){max_prestasi = 4}
        if(max_prestasi >= 81 && max_prestasi <= 100 ){max_prestasi = 5}

        //----------------------------------------------------Normalisasi----------------------------------------------------
        //bobot kedisiplinan
        let normalisasi_kedisiplinan
        if(nilai_kedisiplinan <= 40){
            normalisasi_kedisiplinan = 2/max_kedisiplinan
        }
        if(nilai_kedisiplinan >= 41 && nilai_kedisiplinan <= 60 ){
            normalisasi_kedisiplinan = 3/max_kedisiplinan
        }
        if(nilai_kedisiplinan >= 61 && nilai_kedisiplinan <= 80 ){
            normalisasi_kedisiplinan = 4/max_kedisiplinan
        }
        if(nilai_kedisiplinan >= 81 && nilai_kedisiplinan <= 100 ){
            normalisasi_kedisiplinan = 5/max_kedisiplinan
        }
        
        //bobot kerjasama
        let normalisasi_kerjasama
        if(nilai_kerjasama <= 40){
            normalisasi_kerjasama = 2/max_kerjasama
        }
        if(nilai_kerjasama >= 41 && nilai_kerjasama <= 60 ){
            normalisasi_kerjasama = 3/max_kerjasama
        }
        if(nilai_kerjasama >= 61 && nilai_kerjasama <= 80 ){
            normalisasi_kerjasama = 4/max_kerjasama
        }
        if(nilai_kerjasama >= 81 && nilai_kerjasama <= 100 ){
            normalisasi_kerjasama = 5/max_kerjasama
        }

        //bobot inisiatif
        let normalisasi_inisiatif
        if(nilai_inisiatif <= 40){
            normalisasi_inisiatif = 2/max_inisiatif
        }
        if(nilai_inisiatif >= 41 && nilai_inisiatif <= 60 ){
            normalisasi_inisiatif = 3/max_inisiatif
        }
        if(nilai_inisiatif >= 61 && nilai_inisiatif <= 80 ){
            normalisasi_inisiatif = 4/max_inisiatif
        }
        if(nilai_inisiatif >= 81 && nilai_inisiatif <= 100 ){
            normalisasi_inisiatif = 5/max_inisiatif
        }

        //bobot kinerja
        let normalisasi_kinerja
        if(nilai_kinerja <= 40){
            normalisasi_kinerja = 2/max_kinerja
        }
        if(nilai_kinerja >= 41 && nilai_kinerja <= 60 ){
            normalisasi_kinerja = 3/max_kinerja
        }
        if(nilai_kinerja >= 61 && nilai_kinerja <= 80 ){
            normalisasi_kinerja = 4/max_kinerja
        }
        if(nilai_kinerja >= 81 && nilai_kinerja <= 100 ){
            normalisasi_kinerja = 5/max_kinerja
        }

        //bobot tanggungJawab
        let normalisasi_tanggungJawab
        if(nilai_tanggungJawab <= 40){
            normalisasi_tanggungJawab = 2/max_tanggungJawab
        }
        if(nilai_tanggungJawab >= 41 && nilai_tanggungJawab <= 60 ){
            normalisasi_tanggungJawab = 3/max_tanggungJawab
        }
        if(nilai_tanggungJawab >= 61 && nilai_tanggungJawab <= 80 ){
            normalisasi_tanggungJawab = 4/max_tanggungJawab
        }
        if(nilai_tanggungJawab >= 81 && nilai_tanggungJawab <= 100 ){
            normalisasi_tanggungJawab = 5/max_tanggungJawab
        }

        //bobot prestasi
        let normalisasi_prestasi
        if(nilai_prestasi <= 40){
            normalisasi_prestasi = 2/max_prestasi
        }
        if(nilai_prestasi >= 41 && nilai_prestasi <= 60 ){
            normalisasi_prestasi = 3/max_prestasi
        }
        if(nilai_prestasi >= 61 && nilai_prestasi <= 80 ){
            normalisasi_prestasi = 4/max_prestasi
        }
        if(nilai_prestasi >= 81 && nilai_prestasi <= 100 ){
            normalisasi_prestasi = 5/max_prestasi
        }

        //-----------------------------------------------------Ambil Bobot kriteria-----------------------------------------------------

        let bobot_kedisiplinan = await Criterion.findOne({attributes:['bobot_kriteria'], where: { nama_kriteria : 'Kedisiplinan' }})
        let bobot_kerjasama = await Criterion.findOne({attributes:['bobot_kriteria'], where: { nama_kriteria : 'Kerjasama' }})
        let bobot_inisiatif = await Criterion.findOne({attributes:['bobot_kriteria'], where: { nama_kriteria : 'Inisiatif' }})
        let bobot_kinerja = await Criterion.findOne({attributes:['bobot_kriteria'], where: { nama_kriteria : 'Kinerja' }})
        let bobot_tanggungJawab = await Criterion.findOne({attributes:['bobot_kriteria'], where: { nama_kriteria : 'Tanggung Jawab' }})  
        let bobot_prestasi = await Criterion.findOne({attributes:['bobot_kriteria'], where: { nama_kriteria : 'Prestasi' }})

        // return res.json(bobot_kedisiplinan['bobot_kriteria'])
        
        //------------------------------------------------------------Nilai Akhir------------------------------------------------------------
        let nilai_akhir_kedisiplinan = normalisasi_kedisiplinan * bobot_kedisiplinan['bobot_kriteria']
        let nilai_akhir_kerjasama = normalisasi_kerjasama * bobot_kerjasama['bobot_kriteria']
        let nilai_akhir_inisiatif = normalisasi_inisiatif * bobot_inisiatif['bobot_kriteria']
        let nilai_akhir_kinerja = normalisasi_kinerja * bobot_kinerja['bobot_kriteria']
        let nilai_akhir_tanggungJawab = normalisasi_tanggungJawab * bobot_tanggungJawab['bobot_kriteria']
        let nilai_akhir_prestasi = normalisasi_prestasi * bobot_prestasi['bobot_kriteria']

        let total = nilai_akhir_kedisiplinan + nilai_akhir_kerjasama + nilai_akhir_inisiatif + nilai_akhir_kinerja + nilai_akhir_tanggungJawab + nilai_akhir_prestasi

        //----------------------------------------------------Save data ke dalam object----------------------------------------------------
           ranking.normalisasi_kedisiplinan = normalisasi_kedisiplinan 
           ranking.normalisasi_kerjasama = normalisasi_kerjasama 
           ranking.normalisasi_inisiatif = normalisasi_inisiatif 
           ranking.normalisasi_kinerja = normalisasi_kinerja 
           ranking.normalisasi_tanggungJawab = normalisasi_tanggungJawab
           ranking.normalisasi_prestasi = normalisasi_prestasi
           ranking.nilai_akhir_kedisiplinan  = nilai_akhir_kedisiplinan
           ranking.nilai_akhir_kerjasama = nilai_akhir_kerjasama
           ranking.nilai_akhir_inisiatif = nilai_akhir_inisiatif
           ranking.nilai_akhir_kinerja = nilai_akhir_kinerja
           ranking.nilai_akhir_tanggungJawab = nilai_akhir_tanggungJawab
           ranking.nilai_akhir_prestasi = nilai_akhir_prestasi
           ranking.total = total
           await ranking.save()

        return res.json(ranking)

    } catch(err){
        return res.status(400).json(err)
    }
}

//ExportAll
const exportAll = async (req,res) => {
    try{
        let {datepicker} = req.query
       
        let startDate= (_.isEmpty(datepicker) ? new Date("2021-04-12") : new Date(datepicker))
        let filterDate = startDate.getMonth() + 1
        let yearDate = startDate.getFullYear()
        const ranking = await Employee_ranking.findAndCountAll({

            attributes: [
                'id','pegawai_id','nilai_kedisiplinan','nilai_kerjasama','nilai_inisiatif','nilai_kinerja','nilai_tanggungJawab','nilai_prestasi','total'
            ], 
            include: {model: Employee, attributes : ['nama_pegawai']},
            where : 
                [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('Employee_ranking.created_at')), filterDate),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('Employee_ranking.created_at')), yearDate),
                    sequelize.where(sequelize.fn('NOT', sequelize.col('Employee.id')), null),
                ],
            
            order : sequelize.col('Employee_ranking.total'),       
        });
        return res.status(200).json({data : { data : ranking.rows, total: ranking.count}})
        

    
    }catch (err){
        return res.status(500).json({ error: 'Something went wrong'})
    }
}


module.exports = {rankingGetAll, rankingPost, rankingEmployee, exportAll}