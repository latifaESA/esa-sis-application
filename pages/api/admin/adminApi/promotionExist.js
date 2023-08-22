const {   promotionExist } = require("../../controller/queries");

const PromotionExist = async( connection ,promotion_name)=>{

    
    const exist = await promotionExist(connection ,promotion_name)
   
    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default PromotionExist;