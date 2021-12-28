<template>
  <div class="actions space-x-2 space-y-2 mb-2">
    <input class="input input-bordered input-sm" placeholder="输入关键词" type="text" @input="search" />
    <button :disabled="!hasSelected" class="btn btn-sm md:btn-sm btn-primary" @click="del">删除</button>

    <div class="dropdown dropdown-hover">
      <div class="btn btn-sm" tabindex="0">
        {{ POST_STATE_ENUM[state.status] || '全部' }}
        <svg
          class="inline-block w-4 h-4 ml-2 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </div>
      <ul class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-32" tabindex="0">
        <li @click="changeStatus">
          <a>全部&nbsp;&nbsp;{{ state.status == '' || state.status == '10' ? '√' : '' }}</a>
        </li>
        <li
          v-for="item in POST_STATE.filter((_) => +_.level >= +state.user.level)"
          :key="item.value"
          @click="state.status = item.value"
        >
          <a>{{ item.key }}&nbsp;&nbsp;{{ state.status == item.value ? '√' : '' }}</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="overflow-x-auto mb-4">
    <table class="table w-full table-compact table-zebra m-2">
      <thead>
        <tr>
          <th>
            <label>
              <div class="indicator">
                <div class="indicator-item badge badge-secondary">{{ list.selected.length }}</div>
                <input :checked="isSelectedAll" class="checkbox" type="checkbox" @change="toggleSelectedAll" />
              </div>
            </label>
          </th>
          <th v-if="isAdmin(state.user.level)">ID</th>
          <th>Title</th>
          <th v-if="isAdmin(state.user.level)">Creator</th>
          <th pointer @click="toggleSort">
            Create At
            <svg
              class="h-4 w-4 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                v-if="state.order === 'DESC'"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                v-else
                d="M8 7l4-4m0 0l4 4m-4-4v18"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </th>
          <th>update_time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of list.data" :key="item.id" class="hover">
          <th>
            <label>
              <input v-model="list.selected" :value="item" class="checkbox" type="checkbox" />
            </label>
          </th>
          <th v-if="isAdmin(state.user.level)">{{ item.id }}</th>
          <th pointer @click="pushGv(item.id)" class="primary-color">{{ item.title }}</th>
          <th v-if="isAdmin(state.user.level)">{{ item.creator_name }}</th>
          <th>{{ getTimeDistance(item.create_time) }}</th>
          <th>{{ getTimeDistance(item.update_time) }}</th>
          <th>{{ POST_STATE_ENUM[item.status] }}</th>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="btn-group justify-end">
    <button class="btn btn-sm" @click="state.page -= 1">Previous</button>
    <button class="btn btn-active btn-sm">{{ state.page }}</button>
    <button class="btn btn-sm" @click="state.page += 1">Next</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { deletePostByIds, getPost, getPosts } from '../utils/api'
import debounce from 'lodash.debounce'
import { isAdmin, POST_STATE, POST_STATE_ENUM } from '../constant'
import { getLocalUser } from '../utils/localstorage'
import useSelect from '../shared/use-select'
import { watch } from '@vue/runtime-core'
import { getTimeDistance } from '../utils/date'

const prePage = ref(1)
const router = useRouter()
const state = reactive({
  gv: null,
  key: '',
  status: '',
  page: 1,
  size: 30,
  order: 'DESC',
  state: '',
  user: getLocalUser()
})
const [list, toggleSelectedAll, isSelectedAll, hasSelected] = useSelect<any>()

const changeStatus = () => {
  if (state.user.level > 1) {
    state.status = ''
  } else {
    state.status = '10'
  }
}

const _effect = () => {
  if (typeof parseInt(state.key) == 'number' && !isNaN(parseInt(state.key))) {
    getPost(state.key).then((_) => {
      list.data = _.data ? [_.data] : []
    })
  } else {
    const uid = !isAdmin(state.user.level) ? state.user.id : undefined
    if (isAdmin(state.user.level) && state.status == '') {
      state.status = '10'
    }

    getPosts(state.status, '', '', uid, state.page, state.size, state.order, state.key).then((res) => {
      if (res.code === 200) {
        if (prePage.value < state.page) {
          list.data = list.data.concat(res.posts || [])
          prePage.value = state.page
        } else {
          list.data = res.data || []
        }
      }
    })
  }
  list.selected = []
}

watch(state, _effect, { immediate: true })

function pushGv(id: string) {
  router.push(`/upload/${id || state.gv}`)
}

function toggleSort() {
  if (state.order === 'DESC') state.order = 'ASC'
  else state.order = 'DESC'
}

const search = debounce(
  (e) => {
    state.key = e.target.value
  },
  800,
  { leading: false }
)

const del = () => {
  deletePostByIds(list.selected.map((_) => _.id)).then(_effect)
}
</script>
