import { computed, reactive } from 'vue'
import { toRaw } from '@vue/reactivity'

export type Props<T> = {
  data: Array<T>
  selected: Array<T>
}

export default function useSelect<T>(props: Props<T> = { data: [], selected: [] }) {
  const state = reactive<Props<T>>(props)

  const hasSelected = computed(() => state.selected.length > 0)

  const isSelectedAll = computed(() => hasSelected && state.data.length == state.selected.length)

  const toggleSelectedAll = () => (state.selected = isSelectedAll.value ? [] : state.data)

  return [state, toggleSelectedAll, isSelectedAll, hasSelected] as const
}
