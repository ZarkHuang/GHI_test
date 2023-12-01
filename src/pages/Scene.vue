<template>
  <section class="cards">
    <article v-for="(card, index) in cards" :key="index" @mouseover="hoverOn(card)" @mouseleave="hoverOff(card)"
      @click="toProject(card.eng)" class="card">
      <div class="card__img-container" :style="{ backgroundColor: card.isHovering ? card.hoverBackgroundColor : '' }">
        <component :is="card.isHovering ? card.hoverIcon : card.icon" class="card__img" />
      </div>
      <div class="card__info text-center">
        <h3 class="card__title">{{ card.name }}</h3>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { reactive, markRaw , defineAsyncComponent  } from 'vue';
import { useRouter } from "vue-router";

// icon
const FirstVist = defineAsyncComponent(() => import('@/assets/icons/firstVisit.svg'));
const FirstVisitWhite = defineAsyncComponent(() => import('@/assets/icons/firstVisitWhite.svg'));
const Nursing = defineAsyncComponent(() => import('@/assets/icons/nursing.svg'));
const NursingWhite = defineAsyncComponent(() => import('@/assets/icons/nursingWhite.svg'));
const Heart = defineAsyncComponent(() => import('@/assets/icons/heart.svg'));
const HeartWhite = defineAsyncComponent(() => import('@/assets/icons/heartWhite.svg'));
const ThyroidUS = defineAsyncComponent(() => import('@/assets/icons/thyroidUS.svg'));
const ThyroidUSWhite = defineAsyncComponent(() => import('@/assets/icons/thyroidUSWhite.svg'));
const meeting = defineAsyncComponent(() => import('@/assets/icons/meeting.svg'));
const meetingWhite = defineAsyncComponent(() => import('@/assets/icons/meetingWhite.svg'));
const weekSummary = defineAsyncComponent(() => import('@/assets/icons/weekSummary.svg'));
const weekSummaryWhite = defineAsyncComponent(() => import('@/assets/icons/weekSummaryWhite.svg'));

const router = useRouter()

interface Card {
  name: string;
  eng: string;
  icon: any;
  hoverIcon: any;
  hoverBackgroundColor: string;
  isHovering: boolean;
}

const cards = reactive<Card[]>([
  {
    name: "初診",
    eng: "FirstVisit",
    icon: markRaw(FirstVist),
    hoverIcon: markRaw(FirstVisitWhite),
    hoverBackgroundColor: '#57a4f2',
    isHovering: false
  },
  {
    name: "護理紀錄",
    eng: "Nursing",
    icon: markRaw(Nursing),
    hoverIcon: markRaw(NursingWhite),
    hoverBackgroundColor: '#57a4f2',
    isHovering: false
  },
  {
    name: "兒科心臟超音波檢驗檢查報告",
    eng: "ChildHeartUS",
    icon: markRaw(Heart),
    hoverIcon: markRaw(HeartWhite),
    hoverBackgroundColor: '#57a4f2',
    isHovering: false
  },
  {
    name: "甲狀腺超音波檢驗檢查報告",
    eng: "ThyroidUS",
    icon: markRaw(ThyroidUS),
    hoverIcon: markRaw(ThyroidUSWhite),
    hoverBackgroundColor: '#57a4f2',
    isHovering: false
  },
  {
    name: "會議記錄",
    eng: "Meeting",
    icon: markRaw(meeting),
    hoverIcon: markRaw(meetingWhite),
    hoverBackgroundColor: '#57a4f2',
    isHovering: false
  },
  {
    name: "Week Summary",
    eng: "Inpatient",
    icon: markRaw(weekSummary),
    hoverIcon: markRaw(weekSummaryWhite),
    hoverBackgroundColor: '#57a4f2',
    isHovering: false
  },
]);

const toProject = (sceneType: string) => {
  console.log(sceneType)
  router.push({ path: '/project', query: { sceneType: sceneType } })
}
const hoverOn = (card: Card) => {
  card.isHovering = true;
}
const hoverOff = (card: Card) => {
  card.isHovering = false;
}
</script>

<style scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 40px;
  height: 90vh;
}


.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 164px;
  background-color: var(--background-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 5px 15px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: var(--text);
  padding: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0, 1);
}


.card__img-container {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  /* 水平居中 */
  background-color: var(--primary-hover2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card__img {
  max-width: 100%;
  max-height: 100%;
}

.card__info {
  margin-top: 10px;
  /* 增加一點距離 */
  min-height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 置中文字 */
}

.card:hover {
  box-shadow: 0px 30px 18px -8px rgba(0, 0, 0, 0.1);
  transform: scale(1.1, 1.1);
  background-color: var(--primary);
  color: #fff;
}

/* 媒體查詢 - 小於 1280px */
@media (max-width: 1280px) {
  .cards {
    height: auto;
    padding: 40px;
  }

  .card {
    margin: 0;
    margin-bottom: 20px;
    width: 100%;
  }
}

/* 媒體查詢 - 小於 576px */
@media (max-width: 576px) {
  .cards {
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 8px;
  }

  .card {
    width: calc(50% - 16px);
    margin-bottom: 16px;
  }

  .card:hover {
    transform: scale(1.05);
  }
}
</style>