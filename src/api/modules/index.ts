import {GET,POST,FILE,FILEPOST,PUT,GETNOBASE} from "../api";
const indexUrl=  {
    // 'leftTop':'/bigscreen/countDeviceNum',//左上
    'leftTop':'/bigscreen/leftTop',//左上
    'leftCenter':'/bigscreen/countUserNum',//左中
    "centerMap":"/bigscreen/centerMap",
    "centerBottom":"/bigscreen/centerBottom",

    'leftBottom':"/bigscreen/leftBottom", //坐下
    'rightTop':"/bigscreen/rightTop", //报警次数
    'rightBottom':'/bigscreen/rightBottom',//右下 
    'rightCenter':'/bigscreen/rightCenter',// 报警排名
}

export default indexUrl

/**左上--设备内总览 */
export const leftTop=(param:any={})=>{
    return GET(indexUrl.leftTop, param);
}

/**左中--用户总览 */
export const countUserNum=(param:any={})=>{
    return GET(indexUrl.leftCenter,param);
}

/**左下--设备提醒 */
export const leftBottom=(year) => {
    const param = { year: year }
    return GET(indexUrl.leftBottom,param);
}

/**中上--地图 */
export const centerMap=(param:any={})=>{
    return GET(indexUrl.centerMap,param);
}

/**中下--安装计划 */
// export const installationPlan=(param:any={})=>{
//     return GET(indexUrl.centerBottom,param)
// }

export const centerBottom=(year_code: string, param:any={})=>{
    param.year_code = year_code;
    return GET(indexUrl.centerBottom, param);
}

/**右上--报警次数 */
export const rightTop=(year_code: string, param:any={})=>{
    param.year_code = year_code;
    return GET(indexUrl.rightTop, param);
}

/**右中--报警排名 */
export const rightCenter=(year_code: string, param:any={})=>{
    param.year_code = year_code;
    return GET(indexUrl.rightCenter,param);
}

/**右下--设备状态 */
export const rightBottom=(year_code: string, param:any={})=>{
    param.year_code = year_code;
    return GET(indexUrl.rightBottom, param);
}