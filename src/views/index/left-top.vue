<script setup lang="ts">
import { onMounted, ref } from "vue";
import { leftTop } from "@/api";
import {ElMessage} from "element-plus"

const option = ref({});

const getData = () => {
  leftTop()
    .then((res) => {
      if (res.success) {
        setOption(res.data);
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
const setOption = async (newData: any) => {
  option.value = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: {
        color: "#FFF",
      },
      formatter: function (params: any) {
        // 添加单位
        var result = params[0].name + "<br>";
        params.forEach(function (item: any) {
          if (item.value) {
            if (item.seriesName == "乡村振兴指数变动") {
              result += item.marker + " " + item.seriesName + " : " + item.value + "%</br>";
            } else {
              result += item.marker + " " + item.seriesName + " : " + item.value + "</br>";
            }
          } else {
            result += item.marker + " " + item.seriesName + " :  - </br>";
          }
        });
        return result;
      },
    },
    legend: {
      // data: ["乡村振兴指数", "乡村振兴指数变动"],
      textStyle: {
        color: "#B4B4B4",
      },
      top: "0",
    },
    grid: {
      left: "50px",
      right: "40px",
      bottom: "30px",
      top: "20px",
    },
    xAxis: {
      data: newData.category,
      axisLine: {
        lineStyle: {
          color: "#B4B4B4",
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: "#B4B4B4",
          },
        },

        axisLabel: {
          formatter: "{value}",
        },
      },
      {
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: "#B4B4B4",
          },
        },
        axisLabel: {
          formatter: "{value}% ",
        },
      },
    ],
    series: [
      {
        name: "农业强",
        type: "bar",
        barWidth: 25,
        itemStyle: {
          color: "#9ecae1",
          // borderRadius: 5,
          // color: new graphic.LinearGradient(0, 0, 0, 1, [
          //   { offset: 0, color: "#956FD4" },
          //   { offset: 1, color: "#3EACE5" },
          // ]),
        },
        data: newData.barAgriculture,
        stack: "x"
      },
      {
        name: "农村美",
        type: "bar",
        barWidth: 25,
        itemStyle: {
        //   borderRadius: 5,
          // color: new graphic.LinearGradient(0, 0, 0, 1, [
          //   { offset: 0, color: "#956FD4" },
          //   { offset: 1, color: "#3EACE5" },
          // ]),
          color: "#addd8e",
        },
        data: newData.barRural,
        stack: "x"
      },
      {
        name: "农民富",
        type: "bar",
        barWidth: 25,
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          // color: new graphic.LinearGradient(0, 0, 0, 1, [
          //   { offset: 0, color: "#956FD4" },
          //   { offset: 1, color: "#3EACE5" },
          // ]),
          color: "#feb24c",
        },
        data: newData.barFarmers,
        stack: "x"
      },
      {
        name: "乡村振兴指数变动",
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 8,
        yAxisIndex: 1,
        itemStyle: {
          color: "#F02FC2",
        },
        data: newData.rateData,
      },
    ],
  };
};
onMounted(() => {
  getData();
});
</script>

<template>
  <v-chart class="chart" :option="option" v-if="JSON.stringify(option) != '{}'" />
</template>

<style scoped lang="scss"></style>
