import request from "@/utils/request";
const api_name = '/admin/product/productUnit'
export const FindAllProductUnit = ()=>{
    return request({
        url: `${api_name}/findAll`,
        method: 'get'
    })
}