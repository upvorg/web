import { createVNode, isVNode } from 'vue'

const slice = Array.prototype.slice

export default function vueJsxCompat(tag, props = null, children = null) {
  if (arguments.length > 3 || isVNode(children)) {
    children = slice.call(arguments, 2)
  }
  return createVNode(tag, props, children)
}
