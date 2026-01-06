import { getCollection, type CollectionEntry } from 'astro:content'
import fs from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import { html } from 'satori-html'
import { COLORS } from '../../styles/tokens'

export async function getStaticPaths() {
	const posts = await getCollection('posts')
	return posts.map(post => ({
		params: { id: post.id },
		props: { post },
	}))
}

interface Props {
	post: CollectionEntry<'posts'>
}

export const GET = async ({ props }: { props: Props }) => {
	const { post } = props

	const fontPath = path.resolve(
		'./node_modules/@fontsource/merriweather/files/merriweather-latin-400-normal.woff',
	)
	const fontData = fs.readFileSync(fontPath)

	const boldFontPath = path.resolve(
		'./node_modules/@fontsource/merriweather/files/merriweather-latin-700-normal.woff',
	)
	const boldFontData = fs.readFileSync(boldFontPath)

	// --- Background Patterns ---
	// Encode single quotes to %27 to avoid breaking CSS url() parsing
	const backgroundAccentEncoded = COLORS.backgroundAccent.replace('#', '')
	const primaryLighterEncoded = COLORS.primaryLighter.replace('#', '')

	const noisePattern =
		`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' viewBox='0 0 700 700' width='700' height='700' opacity='0.33'%3E%3Cdefs%3E%3Cfilter id='nnnoise-filter' x='-20%25' y='-20%25' width='140%25' height='140%25' filterUnits='objectBoundingBox' primitiveUnits='userSpaceOnUse' color-interpolation-filters='linearRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.141' numOctaves='4' seed='15' stitchTiles='stitch' x='0%25' y='0%25' width='100%25' height='100%25' result='turbulence'%3E%3C/feTurbulence%3E%3CfeSpecularLighting surfaceScale='14' specularConstant='0.6' specularExponent='20' lighting-color='%23${backgroundAccentEncoded}' x='0%25' y='0%25' width='100%25' height='100%25' in='turbulence' result='specularLighting'%3E%3CfeDistantLight azimuth='3' elevation='98'%3E%3C/feDistantLight%3E%3C/feSpecularLighting%3E%3C/filter%3E%3C/defs%3E%3Crect width='700' height='700' fill='transparent'%3E%3C/rect%3E%3Crect width='700' height='700' fill='%23${backgroundAccentEncoded}' filter='url(%23nnnoise-filter)'%3E%3C/rect%3E%3C/svg%3E`.replace(
			/'/g,
			'%27',
		)
	const dotPattern =
		`data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='0.75' fill='%23${primaryLighterEncoded}' opacity='0.3'/%3E%3C/svg%3E`.replace(
			/'/g,
			'%27',
		)
	const linePattern =
		`data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-1,11 l2,-2 M0,10 l10,-10 M9,-1 l2,2' stroke='%23${primaryLighterEncoded}' stroke-width='1.5' opacity='0.5'/%3E%3C/svg%3E`.replace(
			/'/g,
			'%27',
		)

	// --- Component Logic ---
	const tagsHtml =
		post.data.tags
			?.slice(0, 3)
			.map(
				(tag: string) => `
    <div style="background-color: ${COLORS.primarySurfaceLight}; color: ${COLORS.primaryHover}; padding: 6px 16px; border-radius: 6px; font-size: 18px; font-weight: 400; margin-right: 12px; display: flex; align-items: center;">
      ${tag}
    </div>
  `,
			)
			.join('') || ''

	const dateStr = new Date(post.data.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	})

	const htmlString = `
    <div
      style="
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: white;
        background-image: url('${dotPattern}'), url('${noisePattern}');
        background-repeat: repeat, repeat;
        background-size: auto, 200px 200px;
        padding: 80px;
        font-family: Merriweather;
      "
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background-color: white;
          position: relative;
        "
      >
        <!-- Blueprint Borders -->
        <!-- Top Line -->
        <div style="position: absolute; display: flex; top: 0; left: -80px; right: -80px; height: 1px; background-color: ${COLORS.borderStrong};"></div>
        <!-- Bottom Line -->
        <div style="position: absolute; display: flex; bottom: 0; left: -80px; right: -80px; height: 1px; background-color: ${COLORS.borderStrong};"></div>
        <!-- Left Line -->
        <div style="position: absolute; display: flex; left: 0; top: -80px; bottom: -80px; width: 1px; background-color: ${COLORS.borderStrong};"></div>
        <!-- Right Line -->
        <div style="position: absolute; display: flex; right: 0; top: -80px; bottom: -80px; width: 1px; background-color: ${COLORS.borderStrong};"></div>

        <!-- Corner Circles -->
        <!-- Top Left -->
        <div style="position: absolute; display: flex; top: -4px; left: -4px; width: 9px; height: 9px; border-radius: 50%; background-color: white;
        border: 1px solid ${COLORS.primarySubtle};
"></div>
        <!-- Top Right -->
        <div style="position: absolute; display: flex; top: -4px; right: -4px; width: 9px; height: 9px; border-radius: 50%; background-color: white;
        border: 1px solid ${COLORS.primarySubtle};
"></div>
        <!-- Bottom Left -->
        <div style="position: absolute; display: flex; bottom: -4px; left: -4px; width: 9px; height: 9px; border-radius: 50%; background-color: white;
        border: 1px solid ${COLORS.primarySubtle};
"></div>
        <!-- Bottom Right -->
        <div style="position: absolute; display: flex; bottom: -4px; right: -4px; width: 9px; height: 9px; border-radius: 50%; background-color: white;
        border: 1px solid ${COLORS.primarySubtle};
"></div>

        <!-- Header Section -->
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: rgba(191, 219, 254, 0.2);
            border-bottom: 1px solid ${COLORS.border};
            padding: 24px 40px;
            position: relative;
          "
        >
          <div style="display: flex; align-items: center; gap: 16px;">
            <span style="font-size: 32px; font-weight: 500; color: ${COLORS.primary};">Async</span>
            <span style="font-size: 18px; color: ${COLORS.primaryLight};">by Asier Zapata</span>
        </div>

        </div>

        <!-- Divider Section with Lines and Diamonds -->
        <div
          style="
            display: flex;
            width: 100%;
            height: 16px;
            background-image: url('${linePattern}');
            background-repeat: repeat;
            position: relative;
            border-bottom: 1px solid ${COLORS.border};
          "
        >
        </div>

        <!-- Main Content Section -->
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            padding: 50px 40px;
          "
        >
          <div style="display: flex; font-size: 54px; font-weight: 700; color: ${COLORS.primary}; line-height: 1.2;">
            ${post.data.title}
          </div>

          <!-- Metadata Footer -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;  padding-top: 30px;">
             <div style="display: flex;">
              ${tagsHtml}
            </div>

            <div style="display: flex; font-size: 20px; color: ${COLORS.textMuted}; font-family: Merriweather; font-weight: 400;">
              ${dateStr}
            </div>
          </div>
        </div>
      </div>
    </div>
  `

	// @ts-ignore - satori types can be tricky with the html template literal result
	const markup = html(htmlString.trim())

	const svg = await satori(markup, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'Merriweather',
				data: fontData,
				style: 'normal',
				weight: 400,
			},
			{
				name: 'Merriweather',
				data: boldFontData,
				style: 'normal',
				weight: 700,
			},
		],
	})

	const resvg = new Resvg(svg)
	const pngData = resvg.render()
	const pngBuffer = pngData.asPng()

	return new Response(new Uint8Array(pngBuffer), {
		headers: {
			'Content-Type': 'image/png',
		},
	})
}
