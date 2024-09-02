<script setup lang="ts">
import { provide, ref } from "vue"
import ItemWrap from "@/components/item-wrap";
import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";

const selectedYearCode = ref(null);
function handleCode(year_code) {
  selectedYearCode.value = year_code;
}

</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap class="contetn_left-top contetn_lr-item" title="2018-2023年中国乡村振兴指数及其变动">
        <LeftTop />
      </ItemWrap>

      <ItemWrap class="contetn_left-center contetn_lr-item" title="2018-2023年乡村振兴一级指标指数">
        <LeftCenter />
      </ItemWrap>
      
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="2018-2023年乡村振兴二级指标指数" style="padding: 0 10px 16px 10px">
        <LeftBottom />
      </ItemWrap>
    </div>

    <div class="contetn_center">
      <CenterMap @mapClickSendData="handleCode" class="contetn_center_top" title="中国乡村振兴指数" />
      <ItemWrap class="contetn_center-bottom" title="乡村振兴指数 Top 10">
        <CenterBottom :year_code="selectedYearCode" />
      </ItemWrap>
    </div>

    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="农业强 Top 10">
        <RightTop :year_code="selectedYearCode" />
      </ItemWrap>

      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="农村美 Top 10" style="padding: 0 10px 16px 10px">
        <RightCenter :year_code="selectedYearCode" />
      </ItemWrap>

      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="农民富 Top 10">
        <RightBottom :year_code="selectedYearCode" />
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}
//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.contetn_center {
  flex: 1;
  margin: 0 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .contetn_center-bottom {
    height: 315px;
  }
}

.contetn_lr-item {
  height: 310px;
}
</style>
