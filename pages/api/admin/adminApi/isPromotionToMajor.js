const {   isPromotionMajor } = require("../../controller/queries");

const PromotionMajorExist = async( connection ,promotion_name ,major_id)=>{

    
    const exist = await isPromotionMajor(connection ,promotion_name , major_id)
   
    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default PromotionMajorExist;