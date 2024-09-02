<script setup lang="ts">
import { rightTop } from "@/api";
import { ref, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";

const option = ref({});

const getData = (year_code) => {
  rightTop(year_code)
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

const setOption = async (data: any) => {
  const abbreviateName = (name: string) => name.length > 4 ? name.slice(0, 4) + '...' : name;
  const nameMap = data.barProvinceName.reduce((map: any, name: string) => {
    map[abbreviateName(name)] = name;
    return map;
  }, {});
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
        var fullName = nameMap[params[0].name];
        var result = fullName + " " + params[0].value;
        return result;
      },
    },
    grid: {
      left: "80px",
      right: "40px",
      bottom: "40px",
      top: "0px",
    },
    xAxis: {
      type: "value",
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
    yAxis: {
      type: "category",
      data: data.barProvinceName.map(abbreviateName),
      axisLabel: {
        color: "#4292c6",
        fontWeight: "500",
        fontSize: 12,
      },
      splitLine: {
        show: false // 不显示x轴网格线
      }
    },
    series: [
      {
        name: "农业强",
        type: "bar",
        // barWidth: 25,
        // itemStyle: {
          // borderRadius: 5,
          // color: new graphic.LinearGradient(0, 0, 0, 1, [
          //   { offset: 0, color: "#956FD4" },
          //   { offset: 1, color: "#3EACE5" },
          // ]),
        // },
        data: data.barAgriculture,
        // y: newData.barProvinceName
      },
    ],
  };
};

onMounted(() => {
  getData("2020_china");
});

const props = defineProps({
  year_code: String
});

watch(() => props.year_code, (new_year_code) => {
  if (new_year_code) {
    getData(new_year_code);
  }
});

</script>

<template>
  <v-chart class="chart" :option="option" />
</template>

<style scoped lang="scss"></style>
