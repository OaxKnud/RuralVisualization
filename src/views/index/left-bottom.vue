<script setup lang="ts">
import { ref, onMounted } from "vue";
import { countUserNum } from "@/api";

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
        fontSize: 12,
      },
      top: "0",
      itemWidth: 12,
      itemHeight: 12,
    },
    grid: {
      left: "60px",
      right: "10px",
      bottom: "20px",
      top: "30px",
    },
    yAxis: {
      type: 'category',
      data: ['文化传承', '精神文明', '物质生活', '公共服务', '基础设施', '人居环境', '生态环境', '产业兴农', '质量兴农', '食物安全'],
      axisLabel: {
        color: function (value, index) {
          if (value == "文化传承" || value == "精神文明" || value == "物质生活") {
            return "#fc4e2a"
          }
          else {
            if (value == "公共服务" || value == "基础设施" || value == "人居环境" || value == "生态环境") {
              return "#41ab5d"
            }
            else {
              return "#4292c6"
            }
          }
        },
        fontWeight: "500",
        fontSize: 12, // 设置标题字号大小
      },
      showMinLabel: false, // 如果需要可以设置为true
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
        type: 'bar',
        data: [
          {value: data[0][0], itemStyle: {color: '#bd0026'}},
          {value: data[0][1], itemStyle: {color: '#bd0026'}},
          {value: data[0][2], itemStyle: {color: '#bd0026'}},
          {value: data[0][3], itemStyle: {color: '#006837'}},
          {value: data[0][4], itemStyle: {color: '#006837'}},
          {value: data[0][5], itemStyle: {color: '#006837'}},
          {value: data[0][6], itemStyle: {color: '#006837'}},
          {value: data[0][7], itemStyle: {color: '#08519c'}},
          {value: data[0][8], itemStyle: {color: '#08519c'}},
          {value: data[0][9], itemStyle: {color: '#08519c'}},
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
        type: 'bar',
        data: [
          {value: data[1][0], itemStyle: {color: '#e31a1c'}},
          {value: data[1][1], itemStyle: {color: '#e31a1c'}},
          {value: data[1][2], itemStyle: {color: '#e31a1c'}},
          {value: data[1][3], itemStyle: {color: '#238443'}},
          {value: data[1][4], itemStyle: {color: '#238443'}},
          {value: data[1][5], itemStyle: {color: '#238443'}},
          {value: data[1][6], itemStyle: {color: '#238443'}},
          {value: data[1][7], itemStyle: {color: '#2171b5'}},
          {value: data[1][8], itemStyle: {color: '#2171b5'}},
          {value: data[1][9], itemStyle: {color: '#2171b5'}},
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
        type: 'bar',
        data: [
          {value: data[2][0], itemStyle: {color: '#fc4e2a'}},
          {value: data[2][1], itemStyle: {color: '#fc4e2a'}},
          {value: data[2][2], itemStyle: {color: '#fc4e2a'}},
          {value: data[2][3], itemStyle: {color: '#41ab5d'}},
          {value: data[2][4], itemStyle: {color: '#41ab5d'}},
          {value: data[2][5], itemStyle: {color: '#41ab5d'}},
          {value: data[2][6], itemStyle: {color: '#41ab5d'}},
          {value: data[2][7], itemStyle: {color: '#4292c6'}},
          {value: data[2][8], itemStyle: {color: '#4292c6'}},
          {value: data[2][9], itemStyle: {color: '#4292c6'}},
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
        type: 'bar',
        data: [
          {value: data[3][0], itemStyle: {color: '#fd8d3c'}},
          {value: data[3][1], itemStyle: {color: '#fd8d3c'}},
          {value: data[3][2], itemStyle: {color: '#fd8d3c'}},
          {value: data[3][3], itemStyle: {color: '#78c679'}},
          {value: data[3][4], itemStyle: {color: '#78c679'}},
          {value: data[3][5], itemStyle: {color: '#78c679'}},
          {value: data[3][6], itemStyle: {color: '#78c679'}},
          {value: data[3][7], itemStyle: {color: '#6baed6'}},
          {value: data[3][8], itemStyle: {color: '#6baed6'}},
          {value: data[3][9], itemStyle: {color: '#6baed6'}},
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
        type: 'bar',
        data: [
          {value: data[4][0], itemStyle: {color: '#feb24c'}},
          {value: data[4][1], itemStyle: {color: '#feb24c'}},
          {value: data[4][2], itemStyle: {color: '#feb24c'}},
          {value: data[4][3], itemStyle: {color: '#addd8e'}},
          {value: data[4][4], itemStyle: {color: '#addd8e'}},
          {value: data[4][5], itemStyle: {color: '#addd8e'}},
          {value: data[4][6], itemStyle: {color: '#addd8e'}},
          {value: data[4][7], itemStyle: {color: '#9ecae1'}},
          {value: data[4][8], itemStyle: {color: '#9ecae1'}},
          {value: data[4][9], itemStyle: {color: '#9ecae1'}},
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
    [50.0, 45.9, 37.2, 43.5, 40.7, 60.1, 72.7, 58.6, 53.6, 46.2], // 2018
    [55.2, 48.1, 40.2, 46.1, 44.3, 62.9, 77.0, 61.2, 57.7, 48.0], // 2019
    [61.2, 56.8, 41.8, 49.2, 48.8, 64.6, 80.2, 67.8, 62.7, 53.2], // 2020
    [67.4, 60.5, 44.9, 51.8, 50.5, 66.4, 81.7, 73.2, 66.7, 56.8], // 2021
    [72.9, 62.2, 47.4, 54.7, 53.6, 68.7, 82.8, 76.5, 69.5, 59.6], // 2022
  ];
  setOption(data)
});
</script>

<template>
  <v-chart class="chart" :option="option" />
</template>

<style scoped lang="scss"></style>
