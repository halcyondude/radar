import Link from 'next/link'
import { colors } from '../styles.config'
import Search from './Search'
import NavLink from './NavLink'

export default _ => {
  return <nav className="navbar" role="navigation" aria-label="main navigation">
    <style jsx>{`
      nav {
        background: ${colors.darkPurple};
        padding-top: 10px;
        padding-bottom: 10px;
      }
      
      nav img {
        max-height: initial;
      }
    `}</style>

    <div className="container">
      <div className="navbar-brand">
        <Link href="/">
          <NavLink><img src="/logo-horizontal-white.svg" alt="CNCF End User Radar" width="190" /></NavLink>
        </Link>
      </div>

      <div className="navbar-menu">
        <div className="navbar-end">
          <Search/>
          <Link href="/overview" passHref><NavLink>Technologies Overview</NavLink></Link>
        </div>
      </div>
    </div>
  </nav>
}
