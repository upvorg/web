<template>
  <div :class="{ upload, curr: step === 0, 'mx-auto': true, 'space-y-4': true }">
    <div class="flex w-full flex-col md:flex-row justify-center">
      <div class="editor w-full md:mr-5" style="max-width: 46rem">
        <input
          v-model="post.title"
          class="input input-bordered w-full mb-4 mr-4"
          placeholder="请输入标题"
          type="text"
        />
        <MilkdownEditor v-model="post.content" />
        <ul class="tags mt-4" v-if="post.type == 'video'">
          <kbd
            class="kbd m-1"
            v-for="item in TAGS"
            :key="item"
            :class="{ active: post.tag.indexOf(item) > -1 }"
            @click="selectTag(item)"
          >
            {{ item }}
          </kbd>
        </ul>
      </div>
      <div class="options w-max">
        <div class="form-control flex-row">
          <label
            class="cursor-pointer label"
            v-for="item in [
              ['文章', 'post'],
              ['视频', 'video']
            ]"
          >
            <input type="radio" name="opt" v-model="post.type" class="radio" :value="item[1]" />
            <span class="label-text ml-2">{{ item[0] }}</span>
          </label>
        </div>
        <div class="md:flex md:flex-col">
          <select
            class="select select-bordered select-sm"
            v-model="post.status"
            v-if="isAdmin(GlobalState.user?.level) || isModify || post.type == 'video'"
            :disabled="!isAdmin(GlobalState.user?.level)"
          >
            <option v-for="item in Object.keys(POST_STATE_ENUM)" :value="item">
              {{ POST_STATE_ENUM[item] }}
            </option>
          </select>
          <select v-model="post.sort" v-if="post.type == 'video'" class="select select-bordered select-sm">
            <option>番剧</option>
            <option>原创</option>
            <option>转载</option>
            <option>新番</option>
            <option>剧场版</option>
            <option>完结</option>
          </select>
        </div>
      </div>
    </div>

    <p class="text-center mt-4">
      <button
        v-if="post.type == 'video'"
        class="btn btn-primary btn-outline btn-sm mr-2"
        @click="stepHandler(step + 1)"
      >
        下一步
      </button>
      <button class="btn btn-primary btn-outline btn-sm" @click="upload">
        {{ isModify ? '修改并发布' : '发布' }}
      </button>
    </p>
  </div>

  <div :class="{ upload, curr: step === 1 }">
    <div class="actions">
      <button class="btn btn-outline btn-sm" @click="stepHandler(step - 1)">上一步</button>
      <button class="btn btn-outline btn-sm" @click="showAddVideo">添加剧集</button>
      <button class="btn btn-primary btn-sm float-right" @click="upload">
        {{ isModify ? '修改发布' : '投 稿' }}
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>集</th>
            <th>Name</th>
            <th>url</th>
            <th>发布时间</th>
            <th>更新时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in combineVideos">
            <th>{{ item?.oid }}</th>
            <td>{{ item?.title }}</td>
            <td>{{ url(item?.content) }}</td>
            <td>{{ getTimeDistance(item?.create_time) }}</td>
            <td>{{ getTimeDistance(item?.update_time) }}</td>
            <th>
              <button class="btn btn-ghost btn-xs inline" @click="showModifyVideo(item)">修改</button>
              <button class="btn btn-ghost btn-xs inline" @click="delVideo(item.id)">删除</button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <input
    id="file"
    name="file"
    style="display: none"
    type="file"
    accept="video/mp4, video/x-m4v, video/*"
    @change="fileHandler"
  />

  <ModalWithSlot v-show="isAddVideo">
    <div class="card card-side flex-col md:flex-row">
      <label for="file" class="flex flex-col items-center text-center">
        <img class="rounded-lg p-6 pb-2 w-40 md:w-min" pointer :src="file ? hasFileImage : nofileImage" />
        <p>{{ file?.name?.substr(0, 10) || '点击上传' }}</p>
      </label>
      <div class="max-w-lg card-body">
        <input
          v-model="soltVideo.title"
          class="input input-bordered input-nd mb-6 input-sm"
          placeholder="请输入标题"
          type="text"
        />
        <input
          v-model="soltVideo.content"
          class="input input-bordered input-nd mb-6 input-sm"
          placeholder="请输入链接"
          type="text"
        />
        <span>
          <input v-model="soltVideo.oid" class="input input-bordered inline-block input-sm mr-4 w-12" type="number" />
          集
        </span>

        <div class="card-actions">
          <span
            ><button class="btn btn-sm btn-primary" @click="addVideo">
              {{ isModifyVideo ? '修改' : '添加' }}
            </button></span
          >
          <span><button class="btn btn-sm btn-outline" @click="hideModifyVideo">取消</button></span>
        </div>
      </div>
    </div>
  </ModalWithSlot>
</template>

<script lang="ts">
import { add, deleteVideo, getPost, getVideos, update, updateVideo, uploadApi } from '../utils/api'
import { GlobalState } from '../utils/localstorage'
import { POST_STATE_ENUM, TAGS, isAdmin } from '../constant'
import emitter from '../utils/emitter'
import ModalWithSlot from '../components/ModalWithSlot.vue'
import { MilkdownEditor } from '../components/Editor/MilkdownEditor'
import { getTimeDistance } from '../utils/date'
import { defineComponent } from 'vue'

const emptyVideo = {
  oid: 1,
  title: '',
  content: ''
}

export default defineComponent({
  components: { ModalWithSlot, MilkdownEditor },
  data() {
    return {
      nofileImage: require('../assets/no-file.png'),
      hasFileImage: require('../assets/file-audio.png'),
      GlobalState: GlobalState,
      POST_STATE_ENUM: POST_STATE_ENUM,
      TAGS: TAGS,
      step: 0,
      isModify: false,
      isAddVideo: false,
      isModifyVideo: false,
      file: null as unknown as File,
      videos: [],
      queueVideos: [],
      post: {
        id: null,
        title: '',
        content: '',
        status: '2', // 待审核
        sort: '原创',
        tag: '',
        type: 'post'
      },
      soltVideo: emptyVideo
    }
  },
  computed: {
    combineVideos() {
      return this.queueVideos.concat(this.videos).sort((_, __) => __['create_time'] - _['create_time'])
    }
  },
  mounted() {
    if (this.$route.params.gv) {
      this.isModify = true
      Promise.all([getPost(this.$route.params.gv), getVideos(this.$route.params.gv)]).then(
        ([{ data }, { data: videos }]) => {
          data && (this.post = data)
          this.videos = videos || []
        }
      )
    }
  },
  methods: {
    typeHandler(e) {
      this.post.type = e.target.value
    },
    showAddVideo() {
      this.isAddVideo = true
      this.soltVideo.oid = this.combineVideos.length + 1
    },
    showModifyVideo(item) {
      this.isModifyVideo = true
      this.isAddVideo = true
      this.soltVideo = { ...item }
    },
    hideModifyVideo() {
      this.isAddVideo = false
      this.isModifyVideo = false
      this.resetSoltVideo()
    },
    resetSoltVideo() {
      this.soltVideo.title = ''
      this.soltVideo.content = ''
      this.soltVideo.oid = this.combineVideos?.length + 1 || 0
      this.isAddVideo = false
    },
    delVideo(id) {
      emitter.emit('opm', {
        t: '确认删除 ？',
        ok: () => {
          if (
            !this.queueVideos.some((_, i) => {
              if (_.id === id) {
                this.queueVideos.splice(i, 1)
                return true
              }
              return false
            })
          ) {
            deleteVideo(id, this.id).then((_) => {
              _?.code === 200 && (this.videos = this.videos.filter((_) => _.id !== id))
            })
          }
        }
      })
    },
    async editVideo() {
      const { title, oid, content, id, uid } = this.soltVideo

      if (this.videos.findIndex((_) => _.id == id) != -1) {
        await updateVideo(id, { pid: this.post.id, title, content, oid, uid }).then((_) => {
          _?.code === 200 &&
            this.videos.forEach((_, i) => {
              if (_.id === id) {
                this.videos[i] = { ...this.soltVideo }
              }
            })
        })
      } else {
        this.queueVideos.forEach((_, i) => {
          if (_.id === id) {
            this.queueVideos[i] = { ...this.soltVideo }
          }
        })
      }

      this.isModifyVideo = false
      this.resetSoltVideo()
    },
    async addVideo() {
      const { title, oid, content } = this.soltVideo
      if (!title || !oid || !(this.file || content)) {
        return emitter.emit('alert', {
          type: 'warning',
          text: '请完善视频信息'
        })
      }

      if (this.isModifyVideo) return this.editVideo()

      if (this.combineVideos.some((_) => _.oid === oid)) {
        return emitter.emit('alert', { type: 'warning', text: '已有此集' })
      }

      let src = content
      if (this.file) src = await this.uploadFile()
      this.queueVideos.push({
        title: title,
        oid: oid,
        content: src,
        id: new Date().getTime(),
        create_time: new Date(),
        update_time: new Date()
      })
      this.resetSoltVideo()
    },
    upload() {
      this.checkForm()
      ;[this.post.id ? update : add][0]({ ...this.post, videos: this.queueVideos }).then((res) => {
        if (res.code === 200) this.manage()
      })
    },
    uploadFile() {
      const formData = new FormData()
      formData.append('file', this.file)
      return uploadApi(formData).then((src) => {
        this.file = null
        return src
      })
    },
    checkForm() {
      const { title, content } = this.post
      if (!title || !content) {
        emitter.emit('alert', { type: 'warning', text: '请完善信息' })
        throw new Error('请完善信息')
      }
    },
    stepHandler(n) {
      if (n < 0) n = 0
      if (n > 1) n = 1
      if (this.step === 0) {
        this.checkForm()
      }
      this.step = n
    },
    fileHandler(e) {
      this.file = e.target.files[0]
    },
    selectTag(tag) {
      if (this.post.tag.indexOf(tag) > -1) {
        this.post.tag = this.post.tag.replace(` ${tag}`, '')
      } else {
        this.post.tag += ` ${tag}`
      }
    },
    manage() {
      emitter.emit('alert', {
        type: 'success',
        text: this.isModify ? '修改成功' : '发布成功'
      })
      this.$router.push('/posts')
    },
    url(u) {
      try {
        return new URL(u).origin || u
      } catch (error) {
        return u
      }
    },
    isAdmin,
    getTimeDistance
  },
  watch: {
    isAddVideo(v) {
      document.querySelector('.drawer-content').style.zIndex = v ? 20 : 0
    }
  }
})
</script>

<style lang="scss" scoped>
.upload {
  width: 100%;
  transition: all 0.3s;
  display: none;

  &.curr {
    display: block;
  }

  .table {
    margin: 20px auto;
  }

  .actions {
    button {
      display: inline-block;
      margin-right: 10px;
    }
  }

  textarea {
    min-height: 400px;
  }

  .active {
    background: var(--theme);
    color: #fff;
    background-color: hsla(var(--p) / var(--tw-bg-opacity, 1));
  }

  select,
  option {
    margin: 10px 10px 10px 0;
  }
}

.modal-box {
  input[type='number'] {
    padding-right: 0;
  }
}
</style>
