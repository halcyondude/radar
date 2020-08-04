import { sizes } from '../styles.config'

export default function Section({ title, children }) {
  return <section className="section">
    <style jsx>{`
      h2 {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      
      @media only screen and (max-width: ${sizes.mobile}px) {
        h2 {
          margin-bottom: 1rem;
        }

        .section {
          padding: 1.5rem 1rem;
        }
      }
    `}</style>
    <div className="container">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  </section>
}
