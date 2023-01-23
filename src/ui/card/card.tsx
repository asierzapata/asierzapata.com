import React from 'react'

export const Card = ({
	children
}: {
	className?: string
	children: React.ReactNode
}) => {
	return (
		<div
			className="
						w-full rounded
						bg-gradient-to-br from-primary via-darkPrimary to-secondary
						p-[1px] transition duration-300 hover:from-secondary hover:to-primary
					"
		>
			<div
				className="
							group flex h-full flex-row justify-start
							gap-6 rounded bg-background p-4 transition
							duration-300 hover:bg-lightBackground
						"
			>
				{children}
			</div>
		</div>
	)
}
