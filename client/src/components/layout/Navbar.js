import React, { Component } from 'react'
import bs from '../../globalstyle/bootstrap.min.module.css'
import cx from 'classnames'

class NavbarComp extends Component {
	render() {
		return (
			<nav
				className={cx(
					bs.navbar,
					bs['navbar-expand-sm'],
					bs['navbar-dark'],
					bs['bg-dark'],
					bs['mb-4']
				)}>
				<div className={bs.container}>
					<a className={bs['navbar-brand']} href="landing.html">
						DevConnector
					</a>
					<button
						className={bs['navbar-toggler']}
						type="button"
						data-toggle="collapse"
						data-target="#mobile-nav">
						<span className={bs['navbar-toggler-icon']} />
					</button>

					<div
						className={cx(bs.collapse, bs['navbar-collapse'])}
						id="mobile-nav">
						<ul className={cx(bs['navbar-nav'], bs['mr-auto'])}>
							<li className={bs['nav-item']}>
								<a className={bs['nav-link']} href="profiles.html">
									{' '}
									Developers
								</a>
							</li>
						</ul>

						<ul className={cx(bs['navbar-nav'], bs['ml-auto'])}>
							<li className={bs['nav-item']}>
								<a className={bs['nav-link']} href="register.html">
									Sign Up
								</a>
							</li>
							<li className={bs['nav-item']}>
								<a className={bs['nav-link']} href="login.html">
									Login
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		)
	}
}

export default NavbarComp
