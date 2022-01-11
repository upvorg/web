<template>
  <div class="space-y-4 container md:w-10/12 m-auto">
    <div class="flex flex-col md:flex-row">
      <!-- stats  -->
      <div class="stats grid-rows-2 md:grid-rows-2 grid-flow-col gap-3 w-full shadow-md">
        <div class="stat" v-for="item in STATSET">
          <div :class="`stat-figure ${item.class}`">
            <span class="icon material-icons material-icons-outlined mr-2">{{ item.icon }}</span>
          </div>
          <div class="stat-title">{{ item.title }}</div>
          <div :class="`stat-value ${item.class}`">{{ dashBoardStat[item.value] }}</div>
          <div :class="`stat-desc ${item.class}`">{{ item.desc }}</div>
        </div>
      </div>
      <!-- 个人卡片 -->
      <div class="md:w-1/4 grid p-4 shadow-md rounded-box place-items-center md:mx-4">
        <div class="w-24 h-24 p-px mask mask-squircle bg-base-content bg-opacity-10">
          <img
            :src="dashBoardStat.avatar"
            width="94"
            height="94"
            alt="Avatar Tailwind CSS Component"
            class="mask mask-squircle"
          />
        </div>
        <div>
          <div class="text-center">
            <div class="text-lg font-extrabold">{{ dashBoardStat.nickname }}</div>
            <div class="my-3 text-sm text-base-content text-opacity-60">
              {{ dashBoardStat.post_count }} posts, {{ dashBoardStat.video_count }} videos
            </div>
          </div>
          <div class="mt-2 text-center">
            <!-- <div class="badge badge-ghost">Design</div>
            <div class="badge badge-ghost">Art</div>
            <div class="badge badge-ghost">Illustration</div>-->
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isCreator(dashBoardStat.level)" class="alert bg-base-100 shadow-md">
      <div class="flex-1">
        <label class="mx-3">
          想要获取发帖权限？
          <p class="text-sm text-base-content text-opacity-60">去 QQ 群 @ 群主吧!</p>
        </label>
      </div>
      <div class="flex-none">
        <!-- <button class="btn btn-sm btn-ghost mr-2">Cancel</button> -->
        <a href="https://jq.qq.com/?_wv=1027&k=5lfSD1B" role="button" target="_blank" class="btn btn-sm btn-primary"
          >Go</a
        >
      </div>
    </div>

    <div class="p-4 bg-base-100 shadow-md rounded-box space-y-4">
      <div>
        投稿注意格式
        <div class="text-sm text-base-content text-opacity-60 leading-6">
          <p>地区：日本</p>
          <p>别名：时光碎片/Fragtime</p>
          <p>播放状态：HD</p>
          <p>语言：日语</p>
          <p>首播时间：2019</p>
          <p>动画种类：OVA</p>
          <p>官方网站：http://frag-time.com</p>
          <p>剧情类型：校园,百合,治愈</p>
          <p>更新时间：2021-07-13</p>
        </div>
      </div>
      <div>
        头图抓取规则
        <div class="mt-2 text-sm text-base-content text-opacity-60 leading-6">
          <p>1. 抓取描述关键词`suo` ![suo](https://xxx.com/xxx.png)</p>
          <p>2. 否则文章内出现的一个图片 ![](https://xxx.com/xxx.png)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getUserStat } from '../utils/api'
import { GlobalState, setLocalUser, logout } from '../utils/localstorage'
import { onMounted, ref } from 'vue'
import { isCreator } from '../constant'

type DashBoardStat = {
  avatar: string
  level: number
  pv_count: number
  liked_count: number
  comment_count: number
  collect_count: number
  post_count: number
  video_count: number
  [key: string]: any
}

const STATSET: {
  title: string
  value: keyof DashBoardStat
  icon: string
  desc: string
  class: string
}[] = [
  {
    icon: 'bolt',
    title: 'View',
    value: 'pv_count',
    desc: '浏览量',
    class: 'text-info'
  },
  {
    icon: 'favorite_border',
    title: 'LIKE',
    value: 'liked_count',
    desc: '获得点赞',
    class: 'text-error'
  },
  {
    icon: 'chat_bubble_outline',
    title: 'Comment',
    value: 'comment_count',
    desc: '获得评论',
    class: 'text-primary'
  },
  {
    icon: 'library_add_check',
    title: 'Collect',
    value: 'collect_count',
    desc: '被收藏',
    class: 'text-secondary'
  }
]

const dashBoardStat = ref<DashBoardStat>({
  avatar: '',
  level: 3,
  pv_count: 0,
  liked_count: 0,
  comment_count: 0,
  collect_count: 0,
  post_count: 0,
  video_count: 0
})

onMounted(() => {
  const id = GlobalState.user?.id
  id &&
    getUserStat(id).then(({ data: stat }) => {
      if (GlobalState.user?.level != stat.level) {
        logout()
        return
      }
      setLocalUser(stat)
      GlobalState.user = stat
      dashBoardStat.value = { ...stat }
    })
})
</script>
