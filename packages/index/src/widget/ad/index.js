export default function Ad(props) {
  return (
    <div className="wrap">
      <a href={props.href} target="_blank">
        <section
          style={{
            background: `url(${props.src}) center`,
            width: '100%',
            borderRadius: '2px',
            height: '80px',
            margin: '10px 0',
          }}
          className="ad"
        ></section>
      </a>
    </div>
  )
}
