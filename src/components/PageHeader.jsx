import '../style/pageHeader.css'

function PageHeader({ title }) {
  return (
    <div className={`font-bold text-2xl sm:text-4xl md:text-6xl  capitalize background`}>
      {title}
    </div>
  )
}

export default PageHeader