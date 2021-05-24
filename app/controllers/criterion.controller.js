const { Criterion } = require('../models')

//GetAll
const criterionGetAll = async (req,res) => {
    try{
        const criterion = await Criterion.findAll();

        // const criterion = await Criterion.findAll()
        
        // let work = []
        // criterion.forEach(element => {
            
        //     work.push(element.bobot_kriteria)
            
        // });
        // return res.json(work)
        
        return res.status(200).json({data : {data : criterion }})

        
    }catch (err){
        return res.status(500).json({ error: 'Something went wrong'})
    }
}

//Find by id
const criterionFindOne = async (req,res) => {
    const id = req.params.id
    try{
        const criterion = await Criterion.findOne({
            where: { id }
        })

        return res.json(criterion)
    }catch (err){
        return res.status(500).json({ error: 'Something went wrong'})
    }
}

// //Delete
// const criterionDelete = async (req,res) => {
//     const id = req.params.id
//     try{
//         const criterion = await Criterion.findOne({where: { id } })

//         await criterion.destroy()

//         return res.json({ message: 'Pegawai telah dihapus'})
//     }catch (err){
//         return res.status(500).json({ error: 'Something went wrong'})
//     }
// }

//EDIT
const criterionUpdate = async (req,res) => {
    const id = req.params.id
    const { bobot_kriteria} = req.body
    try{
        
        const criterion = await Criterion.findOne({where: { id }})
        // const data = await Criterion.findOne({where: { nama_kriteria : nama_kriteria }})

        if(criterion === null){
            return res.json('message : Criteria does not exist')
        }else{
            // if(data === null || data.nama_kriteria === criterion.nama_kriteria){
                // criterion.nama_kriteria = nama_kriteria
                criterion.bobot_kriteria = bobot_kriteria
                await criterion.save()
                
                return res.json(criterion)
            // }
            // return res.json('message : Nama kriteria sudah ada')
        }
        
    }catch (err){
        return res.status(500).json({ error: 'Something went wrong'})
    }
} 


module.exports = {criterionGetAll, criterionFindOne, criterionUpdate}