import request from "@/utils/request";

const api_name = "/admin/order/orderStatistics";
export const getOrderStatisticsData = (queryDto) => {
    return request({
        url: `${api_name}/getOrderStatisticsData`,
        method: 'get',
        params: queryDto,
    })
}