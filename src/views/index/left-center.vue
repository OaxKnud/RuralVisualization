<script setup lang="ts">
import { ref, onMounted} from "vue";
import { graphic } from "echarts/core";
import { countUserNum } from "@/api";
import {ElMessage} from "element-plus"

const option = ref({});

const setOption = (data) => {
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
          result += item.marker + " " + item.seriesName + " : " + item.value + "</br>";
        }
      });
      return result;
    },
  },
  legend: {
    data: ["2018-2019", "2019-2020", "2020-2021", "2021-2022", "2022-2023"],
    textStyle: {
      color: "#B4B4B4",
    },
    top: "0",
    itemWidth: 12,
    itemHeight: 12,
  },
  grid: {
    left: "70px",
    right: "40px",
    bottom: "40px",
    top: "30px",
  },
  yAxis: {
    type: 'category',
    data: ['农民富', '农村美', '农业强'],
    axisLabel: {
      color: function (value, index) {
        if (value == "农民富") {
          return "#fc4e2a"
        }
        else {
          if (value == "农村美") {
            return "#41ab5d"
          }
          else {
            return "#4292c6"
          }
        }
      },
      fontWeight: "500",
      fontSize: 15,
    },
    splitLine: {
      show: false // 不显示x轴网格线
    }
  },
  xAxis: {
    type: 'value',
    axisLabel: {
      color: "#7EB7FD",
      fontWeight: "500",
    },
    splitLine: {
      show: false // 不显示x轴网格线
    }
  },
  series: [
    {
      name: "2018-2019",
      type: "bar",
      barWidth: 25,
      data: [
        {value: data[0][0], itemStyle: {color: '#bd0026'}},
        {value: data[0][1], itemStyle: {color: '#006837'}},
        {value: data[0][2], itemStyle: {color: '#08519c'}},
      ],
      stack: "x",
      color: '#08519c',
      label: {
        show: true,  // Show the label
        position: 'inside', // Position it inside
        color: '#FFF',  // White color for visibility
        formatter: '{c}'  // Using series value
      },
    },
    {
      name: "2019-2020",
      type: "bar",
      barWidth: 25,
      data: [
        {value: data[1][0], itemStyle: {color: '#e31a1c'}},
        {value: data[1][1], itemStyle: {color: '#238443'}},
        {value: data[1][2], itemStyle: {color: '#2171b5'}},
      ],
      stack: "x",
      color: '#2171b5',
      label: {
        show: true,  // Show the label
        position: 'inside', // Position it inside
        color: '#FFF',  // White color for visibility
        formatter: '{c}'  // Using series value
      },
    },
    {
      name: "2020-2021",
      type: "bar",
      barWidth: 25,
      data: [
        {value: data[2][0], itemStyle: {color: '#fc4e2a'}},
        {value: data[2][1], itemStyle: {color: '#41ab5d'}},
        {value: data[2][2], itemStyle: {color: '#4292c6'}},
      ],
      stack: "x",
      color: '#4292c6',
      label: {
        show: true,  // Show the label
        position: 'inside', // Position it inside
        color: '#FFF',  // White color for visibility
        formatter: '{c}'  // Using series value
      },
    },
    {
      name: "2021-2022",
      type: "bar",
      barWidth: 25,
      data: [
        {value: data[3][0], itemStyle: {color: '#fd8d3c'}},
        {value: data[3][1], itemStyle: {color: '#78c679'}},
        {value: data[3][2], itemStyle: {color: '#6baed6'}},
      ],
      stack: "x",
      color: '#6baed6',
      label: {
        show: true,  // Show the label
        position: 'inside', // Position it inside
        color: '#FFF',  // White color for visibility
        formatter: '{c}'  // Using series value
      },
    },
    {
      name: "2022-2023",
      type: "bar",
      barWidth: 25,
      data: [
        {value: data[4][0], itemStyle: {color: '#feb24c', borderRadius: [0, 5, 5, 0]}},
        {value: data[4][1], itemStyle: {color: '#addd8e', borderRadius: [0, 5, 5, 0]}},
        {value: data[4][2], itemStyle: {color: '#9ecae1', borderRadius: [0, 5, 5, 0]}},
      ],
      stack: "x",
      color: '#9ecae1',
      label: {
        show: true,  // Show the label
        position: 'inside', // Position it inside
        color: '#FFF',  // White color for visibility
        formatter: '{c}'  // Using series value
      },
    },
  ]
};
};
onMounted(() => {
  let data=[
    [41.2, 52.4, 51.8], // 2018年的数据
    [44.3, 55.7, 54.5], // 2019年的数据
    [48.4, 58.8, 60.1], // 2020年的数据
    [52.1, 60.7, 64.2], // 2021年的数据
    [54.7, 63.2, 67.2]  // 2022年的数据
  ];
  setOption(data)
});
</script>

<template>
  <v-chart class="chart" :option="option" />
</template>

<style scoped lang="scss"></style>
