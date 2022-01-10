<template>
  <div class="space-y-4">
    <div class="flex flex-col flex-wrap xl:flex-nowrap shadow stats md:flex-row shadow-lg">
      <div class="stat md:w-2/6">
        <div class="stat-figure text-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div class="stat-title">Views</div>
        <div class="stat-value text-info">{{ dashBoardStat.read_count }}</div>
        <div class="stat-desc text-info">浏览量</div>
      </div>
      <div class="stat md:w-2/6">
        <div class="stat-figure text-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Likes</div>
        <div class="stat-value text-error">{{ dashBoardStat.like_count }}</div>
        <div class="stat-desc text-error">获得点赞</div>
      </div>
      <div class="stat md:w-2/6">
        <div class="stat-figure text-primary">
          <span class="icon material-icons material-icons-outlined mr-2">chat_bubble_outline</span>
        </div>
        <div class="stat-title">Comments</div>
        <div class="stat-value text-primary">{{ dashBoardStat.comment_count }}</div>
        <div class="stat-desc text-primary">获得评论</div>
      </div>
      <div class="stat md:w-2/6">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Collects</div>
        <div class="stat-value text-secondary">{{ dashBoardStat.collection_count }}</div>
        <div class="stat-desc text-secondary">被收藏</div>
      </div>
      <div class="stat md:w-2/6">
        <div class="stat-figure text-info">
          <div class="avatar online">
            <div class="w-16 h-16 p-1 mask mask-squircle bg-base-100">
              <img :src="dashBoardStat.avatar" alt="Avatar Tailwind CSS Component" class="mask mask-squircle" />
            </div>
          </div>
        </div>
        <div class="stat-value">{{ dashBoardStat.post_count + dashBoardStat.video_count }}</div>
        <div class="stat-title">publish</div>
        <div class="stat-desc text-info">
          {{ dashBoardStat.post_count }} posts, {{ dashBoardStat.video_count }} videos
        </div>
      </div>
    </div>
    <div v-if="!isCreator(dashBoardStat.level)" class="alert bg-base-100 shadow-lg">
      <div class="flex-1">
        <label class="mx-3"
          >想要获取发帖权限？
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

    <div class="alert bg-base-100 shadow-lg">这里也许需要一个图表</div>
  </div>
</template>

<script lang="ts" setup>
import { getUserStat } from '../utils/api'
import { GlobalState, setLocalUser, logout } from '../utils/localstorage'
import { onMounted, reactive } from 'vue'
import { isCreator } from '../constant'

type DashBoardStat = {
  avatar: string
  level: number
  read_count: number
  like_count: number
  comment_count: number
  collection_count: number
  post_count: number
  video_count: number
}
const dashBoardStat = reactive<DashBoardStat>({
  avatar: '',
  level: 3,
  read_count: 0,
  like_count: 0,
  comment_count: 0,
  collection_count: 0,
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
      dashBoardStat.read_count = stat.pv_count ?? 0
      dashBoardStat.like_count = stat.liked_count ?? 0
      dashBoardStat.comment_count = stat.comment_count ?? 0
      dashBoardStat.collection_count = stat.collect_count ?? 0
      dashBoardStat.post_count = stat.post_count ?? 0
      dashBoardStat.video_count = stat.video_count ?? 0
      dashBoardStat.avatar = stat.avatar
      dashBoardStat.level = stat.level
    })
})
</script>
