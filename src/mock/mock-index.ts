import Mock from "mockjs";
//处理路径传参
import { parameteUrl } from "@/utils/query-param"
import { resIndex} from "./data.ts"
import { provinceData, cityData, countyData, regionCodes} from "./mapData.ts"
function ArrSet(Arr: any[], id: string): any[] {
    let obj: any = {}
    const arrays = Arr.reduce((setArr, item) => {
        obj[item[id]] ? '' : (obj[item[id]] = true && setArr.push(item))
        return setArr
    }, [])
    return arrays
}
/**
* @description: min ≤ r ≤ max  随机数
* @param {*} Min
* @param {*} Max
* @return {*}
*/
function RandomNumBoth(Min: any, Max: any) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

function transformRegions(originalRegions): Record<string, string> {
    const transformed: Record<string, string> = {};
    Object.keys(originalRegions).forEach(key => {
        const region = originalRegions[key];
        transformed[region.adcode] = region.name;
    });
    return transformed;
}
const transformedRegions = transformRegions(regionCodes)

const priority = {
    "A+": 9,
    "A": 8,
    "A-": 7,
    "B+": 6,
    "B": 5,
    "B-": 4,
    "C+": 3,
    "C": 2,
    "C-": 1,
    "NaN": 0
}

const priority_total = {
    "三星": 12,
    "二星": 11,
    "一星": 10,
    "一类三星": 9,
    "一类二星": 8,
    "一类一星": 7,
    "二类三星": 6,
    "二类二星": 5,
    "二类一星": 4,
    "三类三星": 3,
    "三类二星": 2,
    "三类一星": 1,
    "NaN": 0
}

//左中
export default [
    {
        url: "/bigscreen/countUserNum",
        type: "get",
        response: () => {
            const a = Mock.mock({
                success: true,
                data: {
                    offlineNum: '@integer(50, 100)',
                    alarmNum: '@integer(20, 100)',
                    lockNum: '@integer(10, 50)',
                    totalNum: 368
                }
            })
            a.data.onlineNum = a.data.totalNum - a.data.offlineNum - a.data.lockNum - a.data.alarmNum
            return a
        },
    },
    {
        url: "/bigscreen/countDeviceNum",
        type: "get",
        response: () => {
            const a = Mock.mock({
                success: true,
                data: {
                    alarmNum: '@integer(100, 1000)',
                    offlineNum: '@integer(0, 50)',
                    totalNum: 698
                }
            })
            a.data.onlineNum = a.data.totalNum - a.data.offlineNum
            return a
        }
    },
    //左下
    {
        url: "/bigscreen/leftBottom",
        type: "get",
        response: (req) => {
            // console.log("test:", req);
            // console.log("test query: ", req.query);
            const year = req.query.year || "2020";

            const getTopNItemsByTotal = (array, n, year) => {
                return [...array]
                    .filter(item => item.year === year)
                    .sort((a, b) => a.strong - b.strong)
                    .slice(0, n);
            };
            let result = getTopNItemsByTotal(resIndex, 10, "2020");
            let item = {
                "barProvinceName": result.map(item => item.provinceName),
                "barAgriculture": result.map(item => item.strong),
            };
            const a = Mock.mock(item)
            return {
                success: true,
                data: a
            }
        }
    },
    //中下
    {
        url: "/bigscreen/centerBottom",
        type: "get",
        response: (req) => {
            // const year = req.query.year;
            const match = /year_code=(.*)/.exec(req.url);
            // console.log(match);
            const split_arr = match[1].split("_");
            const year = split_arr[0];
            let code = split_arr[1];
            if (code === "china") {
                code = "100000";
            }
            const area = transformedRegions[code];

            const getTopNItemsByTotalChina = (array, n, year) => {
                if (area === "中华人民共和国") {
                    return [...array]
                        .filter(item => item.year === year)
                        .sort((a, b) => b.total - a.total)
                        .slice(0, n)
                        .reverse();
                }
            };
            
            const getTopNItemsByTotalProvince = (array, n, year, area) => {
                return [...array]
                .filter(item => item.year === year)
                .filter(item => item.province.substring(0, 2) === area.substring(0, 2))
                .sort((a, b) => priority_total[b.total] - priority_total[a.total])
                .slice(0, n)
                .reverse()
                .map(item => ({
                    ...item,
                    total: priority_total[item.total]
                }));
            }

            const getTopNItemsByTotalCity = (array, n, year, area) => {
                return [...array]
                .filter(item => item.year === year)
                .filter(item => item.city === area)
                .sort((a, b) => priority_total[b.total] - priority_total[a.total])
                .slice(0, n)
                .reverse()
                .map(item => ({
                    ...item,
                    total: priority_total[item.total]
                }));
            }

            let data_for_rank = null
            let result = null
            if (code === "100000") {
                data_for_rank = provinceData;
                result = getTopNItemsByTotalChina(data_for_rank, 10, year).filter(item => item.rich != 0);
            }
            else if (code % 10000 === 0) {
                data_for_rank = cityData;
                result = getTopNItemsByTotalProvince(data_for_rank, 10, year, area).filter(item => item.rich != 0);
            }
            else {
                data_for_rank = countyData;
                result = getTopNItemsByTotalCity(data_for_rank, 10, year, area).filter(item => item.total != 0);
            }

            let item = {
                "barProvinceName": result.map(item => item.name),
                "barTotal": result.map(item => item.total),
            };
            // const colors = ['#ffffff', '#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'];
            // item.barTotal = item.barTotal.map((value, index) => {
            //     const colorsStartIndex = Math.max(colors.length - item.barTotal.length, 0);
            //     return {
            //         value: value,
            //         itemStyle: {
            //             color: colors[colorsStartIndex + index],
            //             borderRadius: [0, 3, 3, 0],
            //         }
            //     }
            // });
            console.log(item);
            const a = Mock.mock(item);
            return {
                success: true,
                data: a
            }
        }
    },
    //右下
    {
        url: "/bigscreen/rightBottom",
        type: "get",
        response: (req) => {
            // const year = req.query.year;
            const match = /year_code=(.*)/.exec(req.url);
            // console.log(match);
            const split_arr = match[1].split("_");
            const year = split_arr[0];
            let code = split_arr[1];
            if (code === "china") {
                code = "100000";
            }
            const area = transformedRegions[code];

            const getTopNItemsByTotalChina = (array, n, year) => {
                if (area === "中华人民共和国") {
                    return [...array]
                        .filter(item => item.year === year)
                        .sort((a, b) => b.rich - a.rich)
                        .slice(0, n)
                        .reverse();
                }
            };
            
            const getTopNItemsByTotalProvince = (array, n, year, area) => {
                // console.log([...array].filter(item => !isNaN(item.rich)));
                return [...array]
                .filter(item => item.year === year)
                .filter(item => item.province.substring(0, 2) === area.substring(0, 2))
                .sort((a, b) => priority[b.rich] - priority[a.rich])
                .slice(0, n)
                .reverse()
                .map(item => ({
                    ...item,
                    rich: priority[item.rich]
                }));
            }

            const getTopNItemsByTotalCity = (array, n, year, area) => {
                return [...array]
                .filter(item => item.year === year)
                .filter(item => item.city === area)
                .sort((a, b) => priority[b.rich] - priority[a.rich])
                .slice(0, n)
                .reverse()
                .map(item => ({
                    ...item,
                    rich: priority[item.rich]
                }));
            }

            let data_for_rank = null
            let result = null
            if (code === "100000") {
                data_for_rank = provinceData;
                result = getTopNItemsByTotalChina(data_for_rank, 10, year).filter(item => item.rich != 0);
            }
            else if (code % 10000 === 0) {
                data_for_rank = cityData;
                result = getTopNItemsByTotalProvince(data_for_rank, 10, year, area).filter(item => item.rich != 0);
            }
            else {
                data_for_rank = countyData;
                result = getTopNItemsByTotalCity(data_for_rank, 10, year, area).filter(item => item.rich != 0);
            }

            let item = {
                "barProvinceName": result.map(item => item.name),
                "barFarmers": result.map(item => item.rich),
            };
            const colors = ['#ffffff', '#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'];
            item.barFarmers = item.barFarmers.map((value, index) => {
                const colorsStartIndex = Math.max(colors.length - item.barFarmers.length, 0);
                return {
                    value: value,
                    itemStyle: {
                        color: colors[colorsStartIndex + index],
                        borderRadius: [0, 3, 3, 0],
                    }
                }
            });
            const a = Mock.mock(item);
            return {
                success: true,
                data: a
            }
        }

    },
    //右上
    {
        url: "/bigscreen/rightTop",
        type: "get",
        response: (req) => {
            // const year = req.query.year;
            const match = /year_code=(.*)/.exec(req.url);
            const split_arr = match[1].split("_");
            const year = split_arr[0];
            let code = split_arr[1];
            if (code === "china") {
                code = "100000";
            }
            const area = transformedRegions[code];
            const getTopNItemsByTotalChina = (array, n, year) => {
                if (area === "中华人民共和国") {
                    return [...array]
                        .filter(item => item.year === year)
                        .sort((a, b) => b.strong - a.strong)
                        .slice(0, n)
                        .reverse();
                }
            };
            
            const getTopNItemsByTotalProvince = (array, n, year, area) => {
                return [...array]
                .filter(item => item.year === year)
                .filter(item => item.province.substring(0, 2) === area.substring(0, 2))
                .sort((a, b) => priority[b.strong] - priority[a.strong])
                .slice(0, n)
                .reverse()
                .map(item => ({
                    ...item,
                    strong: priority[item.strong]
                }));
            }

            const getTopNItemsByTotalCity = (array, n, year, area) => {
                return [...array]
                .filter(item => item.year === year)
                .filter(item => item.city === area)
                .sort((a, b) => priority[b.strong] - priority[a.strong])
                .slice(0, n)
                .reverse()
                .map(item => ({
                    ...item,
                    strong: priority[item.strong]
                }));
            }

            let data_for_rank = null
            let result = null
            if (code === "100000") {
                data_for_rank = provinceData;
                result = getTopNItemsByTotalChina(data_for_rank, 10, year).filter(item => item.strong != 0);
            }
            else if (code % 10000 === 0) {
                data_for_rank = cityData;
                result = getTopNItemsByTotalProvince(data_for_rank, 10, year, area).filter(item => item.strong != 0);
            }
            else {
                data_for_rank = countyData;
                result = getTopNItemsByTotalCity(data_for_rank, 10, year, area).filter(item => item.strong != 0);
            }
            
            let item = {
                "barProvinceName": result.map(item => item.name),
                "barAgriculture": result.map(item => item.strong),
            };
            const colors = ['#ffffff', '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'];
            item.barAgriculture = item.barAgriculture.map((value, index) => {
                const colorsStartIndex = Math.max(colors.length - item.barAgriculture.length, 0);
                return {
                    value: value,
                    itemStyle: {
                        color: colors[colorsStartIndex + index],
                        borderRadius: [0, 3, 3, 0],
                    }
                }
            });
            const a = Mock.mock(item);
            return {
                success: true,
                data: a
            }
        }
    },
    //右中
    {
        url: "/bigscreen/rightCenter",
        type: "get",
        url: "/bigscreen/rightCenter",
        type: "get",
        response: (req) => {
            // const year = req.query.year;
            const match = /year_code=(.*)/.exec(req.url);
            // console.log(match);
            const split_arr = match[1].split("_");
            const year = split_arr[0];
            let code = split_arr[1];
            if (code === "china") {
                code = "100000";
            }
            const area = transformedRegions[code];

            const getTopNItemsByTotalChina = (array, n, year) => {
                if (area === "中华人民共和国") {
                    return [...array]
                        .filter(item => item.year === year)
                        .sort((a, b) => b.beauty - a.beauty)
                        .slice(0, n)
                        .reverse();
                }
            };
            
            const getTopNItemsByTotalProvince = (array, n, year, area) => {
                return [...array]
                .filter(item => item.year === year)
                .filter(item => item.province.substring(0, 2) === area.substring(0, 2))
                .sort((a, b) => priority[b.beauty] - priority[a.beauty])
                .slice(0, n)
                .reverse()
                .map(item => ({
                    ...item,
                    beauty: priority[item.beauty]
                }));
            }

            const getTopNItemsByTotalCity = (array, n, year, area) => {
                return [...array]
                .filter(item => item.year === year)
                .filter(item => item.city === area)
                .sort((a, b) => priority[b.beauty] - priority[a.beauty])
                .slice(0, n)
                .reverse()
                .map(item => ({
                    ...item,
                    beauty: priority[item.beauty]
                }));
            }

            let data_for_rank = null
            let result = null
            if (code === "100000") {
                data_for_rank = provinceData;
                result = getTopNItemsByTotalChina(data_for_rank, 10, year).filter(item => item.beauty != 0);
            }
            else if (code % 10000 === 0) {
                data_for_rank = cityData;
                result = getTopNItemsByTotalProvince(data_for_rank, 10, year, area).filter(item => item.beauty != 0);
            }
            else {
                data_for_rank = countyData;
                result = getTopNItemsByTotalCity(data_for_rank, 10, year, area).filter(item => item.beauty != 0);
            }
            
            let item = {
                "barProvinceName": result.map(item => item.name),
                "barRural": result.map(item => item.beauty),
            };
            const colors = ['#ffffff', '#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'];
            item.barRural = item.barRural.map((value, index) => {
                const colorsStartIndex = Math.max(colors.length - item.barRural.length, 0);
                return {
                    value: value,
                    itemStyle: {
                        color: colors[colorsStartIndex + index],
                        borderRadius: [0, 3, 3, 0],
                    }
                }
            });
            const a = Mock.mock(item);
            return {
                success: true,
                data: a
            }
        }
    },
    //安装计划
    {
        url: "/bigscreen/installationPlan",
        type: "get",
        response: () => {
            let item = {
                "barData": [49.1, 52.0, 56.1, 59.1, 61.8],
                "barAgriculture": [15.5, 16.3, 18.0, 19.3, 20.2],
                "barRural": [21.0, 22.3, 23.5, 24.3, 25.3],
                "barFarmers": [12.4, 13.3, 14.5, 15.6, 16.4],
                "category": ["2018-2019", "2019-2020", "2020-2021", "2021-2022", "2022-2023"],
                "rateData": [0, 2.9, 4.1, 3.1, 2.6]
            }

            const a = Mock.mock(item)
            return {
                success: true,
                data: a
            }
        }
    },
    {
        url: "/bigscreen/leftTop",
        type: "get",
        response: () => {
            let item = {
                "barData": [49.1, 52.0, 56.1, 59.1, 61.8],
                "barAgriculture": [15.5, 16.3, 18.0, 19.3, 20.2],
                "barRural": [21.0, 22.3, 23.5, 24.3, 25.3],
                "barFarmers": [12.4, 13.3, 14.5, 15.6, 16.4],
                "category": ["2018-2019", "2019-2020", "2020-2021", "2021-2022", "2022-2023"],
                "rateData": [0, 2.9, 4.1, 3.1, 2.6]
            }

            const a = Mock.mock(item)
            return {
                success: true,
                data: a
            }
        }
    },
    {
        url: "/bigscreen/centerMap",
        type: "get",
        response: (options: any) => {
            let params = parameteUrl(options.url)
            //不是中国的时候
            if (params.regionCode && !["china"].includes(params.regionCode)) {
                const a = Mock.mock({
                    success: true,
                    data: {
                        "provinceData": provinceData,
                        "cityData": cityData,
                        "countyData": countyData,
                        regionCode: params.regionCode,//-代表中国
                    }
                })
                return a
            } else {
                const a = Mock.mock({
                    success: true,
                    data: {
                        "provinceData": provinceData,
                        "cityData": cityData,
                        "countyData": countyData,
                        regionCode: 'china',
                    }
                })
                // 去重
                // a.data.dataList = ArrSet(a.data.dataList, "name")
                // console.log("map data:",a.data)
                return a
            }
        }
    }
];

