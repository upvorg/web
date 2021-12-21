<template>
  <div :class="{ upload, disabled: auth, curr: step === 0 }">
    <div>
      <input
        v-model="post.title"
        :readonly="auth"
        class="input input-bordered"
        placeholder="请输入标题"
        type="text"
      />
      <MilkdownEditor v-model="post.content" :readonly="auth" />
      <select
        v-model="post.status"
        v-if="isAdmin(GlobalState.user?.level) || isModify"
        :disabled="!isAdmin(GlobalState.user?.level)"
      >
        <option v-for="item in Object.keys(POST_STATE_ENUM)" :value="item">
          {{ POST_STATE_ENUM[item] }}
        </option>
      </select>
      <select v-model="post.sort">
        <option>原创</option>
        <option>番剧</option>
        <option>剧场版</option>
        <option>完结</option>
        <option>转载</option>
      </select>
    </div>
    <ul class="tags">
      <li
        v-for="item in TAGS"
        :key="item"
        :class="{ active: post.tag.indexOf(item) > -1, tag: true }"
        @click="selectTag(item)"
      >
        {{ item }}
      </li>
    </ul>
    <button class="btn btn-primary btn-outline btn-sm mx-auto block" @click="stepHandler(step + 1)">
      下一步
    </button>
  </div>

  <div :class="{ upload, curr: step === 1 }">
    <div class="actions">
      <button class="btn btn-outline btn-sm" @click="stepHandler(step - 1)">上一步</button>
      <button class="btn btn-outline btn-sm" @click="isAddVideo = true">添加剧集</button>
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
              <button class="btn btn-ghost btn-xs inline" @click="showModifyVideo(item)">
                修改
              </button>
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
    @change="fileHandler"
    accept="video/mp4, video/x-m4v, video/*"
  />

  <ModalWithSlot v-show="isAddVideo">
    <div class="card card-side">
      <label for="file" class="flex flex-col items-center text-center">
        <img
          class="rounded-lg p-6 pb-2"
          pointer
          :src="file ? '/images/file-audio.png' : '/images/no-file.png'"
        />
        <p>{{ file?.name || '点击上传' }}</p>
      </label>
      <div class="max-w-lg card-body">
        <input
          v-model="soltVideo.title"
          class="input input-bordered input-nd mb-6"
          placeholder="请输入标题"
          type="text"
        />
        <input
          v-model="soltVideo.content"
          class="input input-bordered input-nd mb-6"
          placeholder="请输入链接"
          type="text"
        />
        <span>
          <input
            v-model="soltVideo.oid"
            class="input input-bordered inline-block input-sm mr-4 w-12"
            type="number"
          />
          集
        </span>

        <div class="card-actions">
          <span
            ><button class="btn btn-sm btn-primary" @click="addVideo">
              {{ isModifyVideo ? '修改' : '添加' }}
            </button></span
          >
          <span
            ><button class="btn btn-sm btn-outline" @click="isAddVideo = false">取消</button></span
          >
        </div>
      </div>
    </div>
  </ModalWithSlot>
</template>

<script>
import { add, deleteVideo, getPost, getVideos, perfix, update, updateVideo } from '../utils/api'
import { GlobalState } from '../utils/localstorage'
import { POST_STATE_ENUM, TAGS, isAdmin } from '../constant'
import emitter from '../utils/emitter'
import ModalWithSlot from '../components/ModalWithSlot.vue'
import { MilkdownEditor } from '../components/Editor/MilkdownEditor'
import { getTimeDistance } from '../utils/date'

const emptyVideo = {
  oid: 1,
  title: '',
  content: '',
}

export default {
  components: { ModalWithSlot, MilkdownEditor },
  data() {
    return {
      GlobalState: GlobalState,
      POST_STATE_ENUM: POST_STATE_ENUM,
      TAGS: TAGS,
      step: 0,
      auth: false,
      isModify: false,
      isAddVideo: false,
      isModifyVideo: false,
      file: null,
      videos: [],
      queueVideos: [],
      post: {
        id: null,
        title: '',
        content: '',
        status: '2', // 待审核
        sort: '原创',
        tag: ' 其它',
      },
      soltVideo: emptyVideo,
    }
  },
  computed: {
    combineVideos() {
      return this.queueVideos.concat(this.videos)
    },
  },
  mounted() {
    if (this.$route.params.gv) {
      this.isModify = true
      Promise.all([getPost(this.$route.params.gv), getVideos(this.$route.params.gv)]).then(
        ([{ result }, { videos }]) => {
          result && (this.post = result)
          this.videos = videos || []
        }
      )

      this.auth = GlobalState.level > 2
    }
  },
  methods: {
    showModifyVideo(item) {
      this.isModifyVideo = true
      this.isAddVideo = true
      this.soltVideo = { ...item }
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
        },
      })
    },
    async editVideo() {
      const { title, oid, content, id, uid } = this.soltVideo

      if (this.videos.findIndex((_) => _.id == id) != -1) {
        await updateVideo(id, { title, content, oid, uid }).then((_) => {
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
          text: '请完善视频信息',
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
        update_time: new Date(),
      })
      this.resetSoltVideo()
    },
    resetSoltVideo() {
      this.soltVideo.title = this.combineVideos?.length + 1 || 0
      this.soltVideo.content = ''
      this.soltVideo.oid = this.combineVideos?.length + 1 || 0
      this.isAddVideo = false
    },
    upload() {
      const { id, title, content, status, sort, tag } = this.post
      const { queueVideos } = this
      const params = { id, title, content, status, sort, tag, videos: queueVideos }
      ;[id ? update : add][0](params).then((res) => {
        if (res.code === 200) this.manage()
      })
    },
    uploadFile() {
      const formData = new FormData()
      formData.append('file', this.file)
      return fetch(`${perfix}/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((_) => _.json())
        .then((_) => (this.vscr = perfix + _.result))
    },
    stepHandler(n) {
      if (n < 0) n = 0
      if (n > 1) n = 1
      if (this.step === 0) {
        if (!this.post.title || !this.post.content) {
          emitter.emit('alert', { type: 'warning', text: '请完善标题和内容' })
          return
        }
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
        text: this.isModify ? '修改成功' : '发布成功',
      })
      this.$router.push('/postmanage')
    },
    url(u) {
      try {
        return new URL(u).origin || u
      } catch (error) {
        return u
      }
    },
    isAdmin,
    getTimeDistance,
  },
}
</script>

<style lang="scss" scoped>
.upload.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

  li {
    display: flex;
    width: auto;
    font-size: 13px;
  }

  .tag {
    background: var(--second);
    color: var(--theme);
    padding: 4px 8px;
    border-radius: 40px;
    display: inline-block;
    cursor: pointer;
    margin: 5px;
  }

  .tags {
    padding: 20px;
  }

  .active {
    background: var(--theme);
    color: #fff;
  }

  select,
  option {
    padding: 10px;
    border: 1px solid var(--second);
    outline: none;
    margin: 10px;
    border-radius: 5px;
  }

  select:hover {
    border: 1px solid var(--theme);
  }

  .steps {
    margin-bottom: 20px;
  }

  textarea,
  input {
    margin-bottom: 20px;
    width: 100%;
  }

  input:focus,
  textarea:focus {
    border: 1px solid var(--theme);
  }
}

.modal-box {
  input[type='number'] {
    padding-right: 0;
  }
}
</style>
