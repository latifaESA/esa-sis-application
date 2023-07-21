const {connect , disconnect} = require('../../../utilities/db')

const {createElective } = require('../controller/queries');

const { default: assignExistElective } = require('./exist/ExistElective');



async function handler (req , res){
    try {
        const connection = await connect()
        const {
            course_id , 
            student_id,
            major_id,
            promotion
        }=req.body;
        const exist = await assignExistElective( connection ,
            course_id , 
            student_id ,
           
            )

            if(exist){
                return res.status(200).json({
                    code : 200 ,
                    success: true,
                    message: `assign is already Exist !`
                })
            }
        const response = await createElective( connection ,course_id , student_id ,major_id , promotion)
    
        await disconnect(connection)
    
        if(response.length === 0){
            return res.status(404).json({
                code:404,
                success :false,
                message : `assign Not Found!`
            })
        }
        else{
            return res.status(201).json({
                success:true,
                code:201,
                message:'Assign Create Successfully',
                data:response.rows[0]
            })
        }
    } catch (error) {
        
    }
}
module.exports = handler