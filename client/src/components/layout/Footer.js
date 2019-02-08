import React from 'react'
import bs from '../../globalstyle/bootstrap.min.module.css'
import cx from 'classnames'

export default function Footer() {
	return (
		<footer
			className={cx(
				bs['bg-dark'],
				bs['text-white'],
				bs['mt-5'],
				bs['p-4'],
				bs['text-center']
			)}>
			Copyright &copy; {new Date().getFullYear()} Dev Connector
		</footer>
	)
}
