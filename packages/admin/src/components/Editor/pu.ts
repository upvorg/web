import css from '@emotion/css'
import { themeFactory } from '@milkdown/core'
import { view } from './view'

const font =
  'Roboto,HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif'

const fontCode = 'Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace'

const iconMapping: Record<string, string> = {
  h1: 'looks_one',
  h2: 'looks_two',
  h3: 'looks_3',
  loading: 'hourglass_empty',
  quote: 'format_quote',
  code: 'code',
  table: 'table_chart',
  divider: 'horizontal_rule',
  image: 'image',
  brokenImage: 'broken_image',
  bulletList: 'format_list_bulleted',
  orderedList: 'format_list_numbered',
  taskList: 'checklist',
  bold: 'format_bold',
  italic: 'format_italic',
  inlineCode: 'code',
  strikeThrough: 'strikethrough_s',
  link: 'link',
  leftArrow: 'chevron_left',
  rightArrow: 'chevron_right',
  upArrow: 'expand_less',
  downArrow: 'expand_more',
  alignLeft: 'format_align_left',
  alignRight: 'format_align_right',
  alignCenter: 'format_align_center',
  delete: 'delete',
  select: 'select_all',
  unchecked: 'check_box_outline_blank',
  checked: 'check_box',
  //
  undo: 'undeo',
  redo: 'redo',
  liftList: 'lift_list',
  sinkList: 'sink_list',
}

export const pu = themeFactory({
  font: {
    typography: font.split(', '),
    code: fontCode.split(', '),
  },
  size: {
    radius: '2px',
    lineWidth: '1px',
  },
  color: {
    line: '#d8dee9',
    background: '#eceff4',
    surface: '#ffffff',
    shadow: '#3b4252',
    primary: '#946ce6', // '#5e81ac',
    secondary: '#946ce6', //'#81a1c1',
    neutral: '#2e3440',
  },
  slots: () => ({
    icon: (id) => {
      const span = document.createElement('span')
      span.className = 'icon material-icons material-icons-outlined'
      span.textContent = iconMapping[id]
      return span
    },
  }),
  mixin: ({ palette }) => ({
    scrollbar: (direction = 'y') => css`
      ${view}
      scrollbar-width: thin;
      scrollbar-color: ${palette('secondary', 0.38)} ${palette('secondary', 0.12)};
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        ${direction === 'y' ? 'width' : 'height'}: 4px;
        padding: 0 2px;
        background: ${palette('surface')};
      }
      &::-webkit-scrollbar-track {
        border-radius: 4px;
        background: ${palette('secondary', 0.12)};
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: ${palette('secondary', 0.38)};
      }
      &::-webkit-scrollbar-thumb:hover {
        background: ${palette('secondary')};
      }
    `,
  }),
  global: ({ palette, font, mixin, size }) => {
    // const css = injectGlobal
    return css`
      .milkdown {
        max-width: 100% !important;
        padding: 0 !important;
        color: ${palette('neutral', 0.87)};
        background: ${palette('surface')};
        position: relative;
        font-family: ${font.typography};
        margin-left: auto;
        margin-right: auto;
        box-shadow: none;
        box-sizing: border-box;
        .editor {
          min-height: 300px;
          outline: none;
          padding: 0;
          & > p {
            margin: 0rem 0;
          }
          & > * {
            margin: 1rem 0;
          }
        }
        & ::selection {
          background: ${palette('secondary', 0.38)};
        }
      }
      .milkdown-root:focus-within {
        border: 1px solid var(--theme);
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 2px hsl(var(--b1)), 0 0 0 4px hsla(var(--bc) / 0.2);
      }
    `
  },
})
