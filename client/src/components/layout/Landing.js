import React, { Component } from 'react'
import style from '../../App.module.css'
import bs from '../../globalstyle/bootstrap.min.module.css'
import cx from 'classnames'

class Landing extends Component {
	render() {
		return (
			<div className={style.landing}>
				<div
					className={cx(
						style['dark-overlay'],
						bs['landing-inner'],
						bs['text-light']
					)}>
					<div className={bs.container}>
						<div className={bs.row}>
							<div className={cx(bs['col-md-12'], bs['text-center'])}>
								<h1 className={cx(bs['display-3'], bs['display-3 mb-4'])}>
									Developer Connector
								</h1>
								<p className={bs.lead}>
									{' '}
									Create a developer profile/portfolio, share posts and get help
									from other developers
								</p>
								<hr />
								<a
									href="register.html"
									className={cx(
										bs.btn,
										bs['btn-lg'],
										bs['btn-info'],
										bs['mr-2']
									)}>
									Sign Up
								</a>
								<a
									href="login.html"
									className={cx(bs.btn, bs['btn-lg'], bs['btn-light'])}>
									Login
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Landing
