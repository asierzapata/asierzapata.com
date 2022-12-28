/* ====================================================== */
/*                      Components                       */
/* ====================================================== */

/* ====================================================== */
/*                        Types                          */
/* ====================================================== */

import type { InferGetStaticPropsType } from "next";

/* ====================================================== */
/*                     Data Loading                      */
/* ====================================================== */

export const getStaticProps = async () => {
	return {
		props: {},
	};
};

/* ====================================================== */
/*                      Component                        */
/* ====================================================== */

function Stack({}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<main>
			<div className="mb-6 flex w-full flex-col-reverse items-center justify-around gap-8 px-12 py-6 lg:flex-row">
				<div className="flex flex-col items-center justify-center">
					<h1
						className="
							mb-4 animate-text
							bg-gradient-to-br from-secondary to-primary
							bg-clip-text text-5xl
							font-extrabold
							text-transparent
						"
					>
						Under construction
					</h1>
				</div>
			</div>
		</main>
	);
}

export default Stack;
