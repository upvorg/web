import mitt from 'mitt'

export type AlertPayload = {
  type: 'info' | 'success' | 'warning'
  text: string
}

export type ModalPayload = {
  t: string
  yesText?: string
  noText?: string
  ok: VoidFunction
  no?: VoidFunction
}

type Events = {
  alert: AlertPayload
  loading: boolean
  opm: ModalPayload
  clm: void
}

export default mitt<Events>()
