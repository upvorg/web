import React from 'react'
import Markdown from '../../components/markdown'

const content = `
## 关于

源码地址： https://github.com/soliury/noder-react-native 。

`

const AboutPage: React.FC = () => {
  return (
    <div className="container">
      <Markdown type="render" value={content} />
    </div>
  )
}

export default AboutPage
