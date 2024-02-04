import React from 'react'
import Home from './Home'
import Videos from './Videos'
import About from './About'

function Layout({ page }) {
    if (page === 1) return <Home />
    if (page === 2) return <Videos />
    if (page === 3) return <About />
    return null
}

export default Layout