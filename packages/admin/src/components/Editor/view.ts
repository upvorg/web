import css from '@emotion/css'

export const view = css`
  /* copy from https://github.com/ProseMirror/prosemirror-view/blob/master/style/prosemirror.css */
  .ProseMirror {
    position: relative;
  }
  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */
  }
  .ProseMirror pre {
    white-space: pre-wrap;
  }
  .ProseMirror li {
    position: relative;
  }
  .ProseMirror-hideselection *::selection {
    background: transparent;
  }
  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }
  .ProseMirror-hideselection {
    caret-color: transparent;
  }
  .ProseMirror-selectednode {
    outline: 2px solid #8cf;
  }
  /* Make sure li selections wrap around markers */
  li.ProseMirror-selectednode {
    outline: none;
  }
  li.ProseMirror-selectednode:after {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }
`
