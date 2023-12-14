<script setup lang="ts">
import { GlobalThemeOverrides } from 'naive-ui'
import { zhTW, dateZhTW } from 'naive-ui'
import type { NLocale, NDateLocale } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2c8eee',
    primaryColorHover: "#2C8EEE",
  },
  Button: {
    textColor: '#333',
    borderColor: '#2c8eee',
    hoverColor: '#2c8eee',  // 將懸停狀態的顏色更改為藍色
    activeColor: '#2c8eee', // 將啟動狀態的顏色更改為藍色
  },
  Input: {
    borderColor: '#2c8eee',

    '&:active': {
      borderColor: '#2c8eee', // 焦點狀態下的邊框顏色
    },
    '&:hover': {
      borderColor: '#2c8eee', // 懸停狀態下的邊框顏色
    },
    Collapse: {
      titlePadding: "0px",
      itemMargin: "0px"
    },
    Switch: {
      railColorActive: "#2C8EEE",
    },
    Radio: {
      radioSizeLarge: "20px",
    },
    DataTable: {
      thColor: "#2C8EEE",
      thTextColor: "#FFFFFF",
      thIconColor: "#FFFFFF",
      thColorHover: "#2C8EEA",
    },
    Dialog: {
      padding: "12px",
      contentMargin: "0px"
    }
  }
}

// 添加語言本地化設置
const locale: NLocale = zhTW
const dateLocale: NDateLocale = dateZhTW

</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-config-provider :locale="locale" :date-locale="dateLocale">
      <n-message-provider> <!-- 添加開始標籤 -->
        <router-view></router-view>
      </n-message-provider> <!-- 添加結束標籤 -->
    </n-config-provider>
  </n-config-provider>
</template>

<style scoped></style>
