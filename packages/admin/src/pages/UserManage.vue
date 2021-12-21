<template>
  <div class="actions">
    <input class="input input-bordered" placeholder="搜索用户" type="text" @input="search" />
    <button :disabled="!hasSelected" class="btn btn-primary" @click="del">封禁</button>

    <div class="dropdown dropdown-hover">
      <div class="btn" tabindex="0">
        {{ USER_ROLE_STATE_MAP[state.status] || '全部' }}
        <svg
          class="inline-block w-6 h-6 ml-2 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </div>
      <ul class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-48" tabindex="0">
        <li
          v-for="item of Object.keys(USER_ROLE_STATE_MAP).sort((a, b) => +b - +a)"
          :key="item"
          @click="state.status = item"
        >
          <a>{{ USER_ROLE_STATE_MAP[item] }}&nbsp;&nbsp;{{ state.status === item ? '√' : '' }}</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="table overflow-x-auto">
    <table class="table w-full table-compact">
      <thead>
        <tr>
          <th>
            <label>
              <div class="indicator">
                <div class="indicator-item badge badge-secondary">
                  {{ list.selected.length || 0 }}
                </div>
                <input
                  :checked="isSelectedAll"
                  class="checkbox"
                  type="checkbox"
                  @change="toggleSelectedAll"
                />
              </div>
            </label>
          </th>
          <th>ID</th>
          <th>Name</th>
          <th>bio</th>
          <th pointer @click="toggleSort">
            Register At
            <svg
              class="h-6 w-6"
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
          <th>Level</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item of list.data"
          :key="item.id"
          :style="{
            color: item.id === GlobalState.user.id ? 'var(--theme)' : '',
          }"
          class="hover"
        >
          <th>
            <label>
              <input v-model="list.selected" :value="item" class="checkbox" type="checkbox" />
            </label>
          </th>
          <th>{{ item.id }}</th>
          <th pointer @click="pushU(item.id)">{{ item.name }}</th>
          <th>{{ item.bio }}</th>
          <th>{{ item.create_time }}</th>
          <th>{{ USER_ROLE_STATE_MAP[item.level] }}</th>
          <th>{{ ['封禁', '正常'][item.status || 1] }}</th>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="btn-group">
    <button class="btn btn-sm" @click="state.page -= 1">Previous</button>
    <button class="btn btn-active btn-sm">{{ state.page }}</button>
    <button class="btn btn-sm" @click="state.page += 1">Next</button>
  </div>
</template>

<script setup>
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { deleteUserByIds, getUser, getUsers, post } from '../utils/api'
import debounce from 'lodash.debounce'
import { USER_ROLE_STATE_MAP } from '../constant'
import emitter from '../utils/emitter'
import { GlobalState } from '../utils/localstorage'
import useSelect from '../shared/use-select'
import { watch } from '@vue/runtime-core'

const prePage = ref(1)
const router = useRouter()
const state = reactive({
  gv: null,
  key: '',
  status: '10',
  page: 1,
  size: 30,
  order: 'DESC',
})
const [list, toggleSelectedAll, isSelectedAll, hasSelected] = useSelect()

const _effect = () => {
  if (typeof parseInt(state.key) == 'number' && !isNaN(parseInt(state.key))) {
    getUser('', state.key, '').then((_) => {
      list.data = [_.result]
    })
  } else {
    getUsers(state.key, state.status, state.page, state.size, state.order).then((_) => {
      if (prePage.value < state.page) {
        list.data = list.data.concat(_.data || [])
        prePage.value = state.page
      } else {
        list.data = _.data || []
      }
    })
  }
}

watch(state, _effect, { immediate: true })

function pushU(id) {
  router.push(`/user/${id}`)
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
  deleteUserByIds(list.selected.map((_) => _.id)).then(_effect)
}
</script>

<style lang="scss" scoped>
ul input {
  width: 200px;
  min-width: 200px;
}

button {
  display: inline-block;
}

.actions {
  display: flex;
  margin-bottom: 20px;

  input,
  button {
    margin: 0 20px 0 0;
  }

  input {
    max-width: 200px;
  }
}

.table {
  width: 100%;

  input {
    display: inline-block;
    margin: 0;
  }

  .table thead th {
    background-color: var(--second);
  }

  thead {
    th > svg {
      height: 12px;
      width: 12px;
      display: inline-block;
    }
  }
}

.btn-group {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
