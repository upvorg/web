export const TOKEN_KEY = 'JWT_TOKEN'
export const USER_KEY = 'USER_INFO'

export const USER_ROLE_STATE_MAP = Object.freeze({
  0: '超级管理员',
  1: '管理员',
  2: '创作者',
  3: '注册用户',
  10: '全部',
})

export const isCreator = (level: number) => level < 3

export const isAdmin = (level: number) => level < 2

export const isHuman = (level: number) => level == 3

export const POST_STATE = Object.freeze([
  { key: '已删除', value: '0', level: 1 },
  { key: '已下架', value: '1', level: 1 },
  { key: '审核中', value: '2', level: 2 },
  { key: '已发布', value: '3', level: 2 },
  // { key: '全部', value: '10', level: 2 }
])

export const POST_STATE_ENUM = Object.freeze({
  3: '已发布',
  2: '审核中',
  1: '已下架',
  0: '已删除',
})

export const TAGS = Object.freeze([
  '推荐',
  '转载',
  '漫画改',
  '小说改',
  '耽美',
  '乙女',
  '百合',
  '后宫',
  '热血',
  '战斗',
  '运动',
  '奇幻',
  '神魔',
  '搞笑',
  '冒险',
  '校园',
  '恐怖',
  '穿越',
  '推理',
  '科幻',
  '日常',
  '古风',
  '恋爱',
  'r15',
  '泡面番',
  '治愈',
  '鬼畜',
  'AMV/MAD',
  '音乐·PV',
  '游戏·GMV',
  'VOCALOID',
  '影视',
  '特摄',
  '真人剧',
  '文章',
  '其它',
])

export const USER_STATUS = Object.freeze({
  0: '封禁|注销',
  1: '正常',
})
