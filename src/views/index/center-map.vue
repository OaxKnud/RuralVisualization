<script setup lang="ts">
import { ref, nextTick, watch, defineEmits } from "vue";
import { centerMap, GETNOBASE } from "@/api";
import { registerMap, getMap } from "echarts/core";
import { optionHandle, regionCodes } from "./center.map";
import BorderBox13 from "@/components/datav/border-box-13";
import { ElMessage } from "element-plus";

import type { MapdataType } from "./center.map";

const option = ref({});
const code = ref("china"); //china 代表中国 其他地市是行政编码
let previous_code = ref([]);
const emit = defineEmits(['mapClickSendData']);

withDefaults(
  defineProps<{
    // 结束数值
    title: number | string;
  }>(),
  {
    title: "地图",
  }
);

const dataSetHandle = async (regionCode: string, list: object[]) => {
  const geojson: any = await getGeojson(regionCode);
  if (geojson === -1) {
    return -1;
  }
  let cityCenter: any = {};
  let mapData: MapdataType[] = [];
  //获取当前地图每块行政区中心点
  // console.log(geojson.features);
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] = element.properties.centroid || element.properties.center;
  });

  //当前中心点如果有此条数据中心点则赋值x，y当然这个x,y也可以后端返回进行大点，前端省去多行代码
  // list.forEach((item: any) => {
  //   // console.log("item:",item)
  //   if (cityCenter[item.name]) {
  //     mapData.push({
  //       name: item.name,
  //       value: cityCenter[item.name].concat(item.value),
  //       // value:item.level
  //     });
  //   }
  // });

  Object.keys(cityCenter).forEach((cityName) => {
    const cityData = list.find(item => item.name === cityName);
    console.log(cityData);
    if (cityData) {
      mapData.push({
        name: cityName,
        value: cityCenter[cityName].concat(cityData.value),
      });
    } 
    else {
      // 如果没有找到对应的数据项，可以选择添加没有数据的点，或者忽略
      mapData.push({
        name: cityName,
        value: cityCenter[cityName].concat(0), // 假设没有数据时value为0
        // 可以选择添加没有数据的点或其他默认值
      });
    }
  });

  await nextTick();
  option.value = optionHandle(regionCode, list, mapData);
};

let selectName = ref(null)

const getData = async (regionCode: string, year:string, indicator:string) => {
  // console.log(regionCode, year, indicator);
  if(regionCode === 'china'){
    selectName.value = null
    // code.value = "100000"
  }
  centerMap({ regionCode: regionCode })
    .then((res) => {
      if (res.success) {
        const levelMap={
          '三类一星': 1,
          '三类二星': 2,
          '三类三星': 3,
          '二类一星': 4,
          '二类二星': 5,
          '二类三星': 6,
          '一类一星': 7,
          '一类二星': 8,
          '一类三星': 9,
          "三星": 10,
          "二星": 11,
          "一星": 12,
          "A+": 0.9,
          "A": 0.8,
          "A-": 0.7,
          "B+": 0.6,
          "B": 0.5,
          "B-": 0.4,
          "C+": 0.3,
          "C": 0.2,
          "C-": 0.1,
          "NAN": 0,
        }
        //过滤年份为year的数据，后续作为形参输入getData
        // let year='2021';
        let current_data = "";
        if (regionCode === "china") {
          current_data = res.data.provinceData;
        }
        else if (regionCode % 10000 === 0) {
          current_data = res.data.cityData;
        }
        else {
          current_data = res.data.countyData;
        }
        const dataListFilter = current_data.filter(item => item.year === year);
        //将list的value1属性修改为value
        // const updatedDataList=null
        // const updatedDataList=[];
        if(indicator==="乡村振兴"){
          const updatedDataList = dataListFilter.map(({ total, ...rest }) => {
            return {
              ...rest,
              value: typeof total === 'string' ? levelMap[total] : total,
            };
          });
          dataSetHandle(res.data.regionCode, updatedDataList);
        }
        else if(indicator==="农村美"){
          const updatedDataList = dataListFilter.map(({ beauty, ...rest }) => {
            return {
              ...rest,
              value: typeof beauty === 'string' ? levelMap[beauty] : beauty,
            };
          });
          dataSetHandle(res.data.regionCode, updatedDataList);
        }
        else if(indicator==="农业强"){
          const updatedDataList = dataListFilter.map(({ strong, ...rest }) => {
            return {
              ...rest,
              value: typeof strong === 'string' ? levelMap[strong] : strong,
            };
          });
          dataSetHandle(res.data.regionCode, updatedDataList);
        }
        else if(indicator==="农民富"){
          const updatedDataList = dataListFilter.map(({ rich, ...rest }) => {
            return {
              ...rest,
              value: typeof rich === 'string' ? levelMap[rich]:rich,
            };
          });
          dataSetHandle(res.data.regionCode, updatedDataList);
        }
      } 
      else {
        ElMessage.error(res.msg);
      }
    }).catch((err) => {
      console.log("here?");
      ElMessage.error(err);
    });
};

const getGeojson = (regionCode: string) => {
  code.value = regionCode;
  return new Promise<boolean>(async (resolve) => {
    let mapjson = getMap(regionCode);
    if (mapjson) {
      mapjson = mapjson.geoJSON;
      resolve(mapjson);
    } 
    else {
      try {
        mapjson = await GETNOBASE(`./map-geojson/${regionCode}.json`).then((data) => data);
        registerMap(regionCode, {
          geoJSON: mapjson as any,
          specialAreas: {},
        });
        resolve(mapjson);
      }
      catch (error) {
        resolve(-1);
      }
    }
  });
};

getData("china", '2020', '乡村振兴');

const mapClick = async (params: any) => {
  // console.log("before click region", code.value);
  // let memory_previous_code = previous_code[-1].value;
  previous_code.value.push(code.value);
  // console.log(previous_code.value);
  selectName.value = params.name
  let xzqData = regionCodes[params.name];
  if (xzqData) {
    const geojsonResult = await getGeojson(xzqData.adcode);
    if (geojsonResult !== -1) { // 检查返回值
      getData(xzqData.adcode, selectedYear.value, selectedIndicator.value);
      emit('mapClickSendData', selectedYear.value + "_" + xzqData.adcode); // 只有成功时才调用
    } else {
      previous_code.value.pop();
      console.log("GeoJSON data not found, no data to send.");
      // ElMessage.error("无有效地图数据！");
    // value = getData(xzqData.adcode, selectedYear.value, selectedIndicator.value);
    // emit('mapClickSendData', selectedYear.value + "_" + xzqData.adcode);
    }
  } 
  else {
    window["$message"].warning("暂无下级地市");
    console.log("herererer");
  }
};

let selectedYear=ref("2020");
let selectedIndicator=ref("乡村振兴");
// 使用 watch 来监控 selectedYear 变量的变化
watch([selectedYear, selectedIndicator], ([newYear, newIndicator], [oldYear, oldIndicator]) => {
  // console.log(oldYear, newYear)
  // console.log(oldIndicator, newIndicator)
  //如果两个指标的值发生了变化，重新从数据中获取新的值
  getData(code.value, newYear, newIndicator);
  // if(oldYear != newYear){
  //   getData(code.value, newYear, oldIndicator)
  // }
  // if(oldIndicator != newIndicator){
  //   getData(code.value, oldYear, newIndicator)
  // }
  emit('mapClickSendData', newYear + "_" + code.value);
});

const handleBack = () => {
  const lastCode = previous_code.value.pop();
  if (lastCode) {
    previous_code.value.push(lastCode);
    getData(lastCode, selectedYear.value, selectedIndicator.value); 
    emit('mapClickSendData', selectedYear.value + '_' + lastCode); 
    previous_code.value.pop(); 
  }
};

const handleGlobal = () => {
  getData('china', selectedYear.value, selectedIndicator.value); 
  emit('mapClickSendData', selectedYear.value + '_' + 'china');
}

</script>

<template>
  <div class="centermap">
  <!-- 添加年份选择下拉菜单 -->
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ selectedYear }}-{{ parseInt(selectedYear) + 1 }}年{{selectName}}{{selectedIndicator}}指数</span>
      <!-- <span>123</span> -->
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <BorderBox13>
        <el-form ref="form" label-width="60px" style="padding-top: 15px; height: 50px; position: relative; z-index: 10;">
          <el-row style="height: 35px;">
            <el-form-item label="年份" class="form_option">
              <el-radio-group v-model="selectedYear" size="small">
                <el-radio-button label="2020-2021" value="2020"></el-radio-button>
                <el-radio-button label="2021-2022" value="2021" ></el-radio-button>
                <el-radio-button label="2022-2023" value="2022"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row style="height: 35px;">
            <el-form-item label="指标" class="form_option">
              <el-radio-group v-model="selectedIndicator" size="small">
                <el-radio-button label="乡村振兴" value="乡村振兴"></el-radio-button>
                <el-radio-button label="农业强" value="农业强" ></el-radio-button>
                <el-radio-button label="农村美" value="农村美"></el-radio-button>
                <el-radio-button label="农民富" value="农民富"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-row>
        </el-form>

        <!-- <el-select v-model="selectedYear" class="m-2" placeholder="请选择年份" size="small" style="height: 10px;width: 100px;padding-top: 15px">
        <el-option
          v-for="item in yearOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
        </el-select>

        <el-select v-model="selectedIndicator" class="m-2" placeholder="请选择指标" size="small" style="height: 10px;width: 100px;padding-top: 15px">
          <el-option
            v-for="item in indicatorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->

        <!-- <span style="text-align: center;color: white;padding-top: 15px">{{selectName}}数据</span> -->
        <div class="quanguo" @click="handleBack" ><span style="margin-right: -5px;">上一级</span></div>
        <div class="quanguo" @click="handleGlobal" style="right: 110px" ><span style="margin-right: -5px;">全国</span></div>
        <v-chart
          class="chart"
          :option="option"
          ref="centerMapRef"
          @click="mapClick"
          v-if="JSON.stringify(option) != '{}'"
        />
      </BorderBox13>
    </div>
  </div>
</template>

<style lang="scss">
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 2px 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url("@/assets/img/xiezuo.png") no-repeat;
    }

    .you {
      background: url("@/assets/img/xieyou.png") no-repeat;
    }
  }

  .mapwrap {
    height: 580px;
    width: 100%;
    // padding: 0 0 10px 0;
    box-sizing: border-box;
    position: relative;

    .quanguo {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5), 0 0 6px rgba(0, 237, 237, 0.4);
      z-index: 10;
    }

    .form_option {
      .el-form-item__label{
        color: white;
        // padding: 0 12px 0 12px;
      }
    }

    .chart {
      position: relative;
      z-index: 5;
    }
  }
}
</style>
