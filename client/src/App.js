import React, { Component } from 'react'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Footer from './components/layout/Footer'
// import style from './App.module.css'
// import { Button } from 'reactstrap'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class App extends Component {
	render() {
		return (
			<div>
				<Navbar />
				<Landing />
				<Footer />
			</div>
		)
	}
}

export default App
