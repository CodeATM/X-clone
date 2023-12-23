import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/Components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        backgroundPrimary: '#000000',
        backgroundBlue: '#000000',
        twitterBlue:' #1976d2',
        twitterDarkBlue: '#1d5fa1',
        twitterGray:' #9898a3',
        twitterLightGray: '#252525',
        twitterBlack: '#f8f8f8',
        twitterLightBlack:' #cecece',
        twitterRed: '#ff4747',
        twitterLightRed: '#210000',
        twitterDarkRed: '#df6a6a',
        twitterOrange: '#ffb898',
        twitterPurple:' #a2a2ff',
        twitterPink: '#7cf2ff',
        twitterWhite: '#16181c',
        twitterMuted: '#71767b',
        hover: '#0c0c0c',
        borderColor: '#1e2022',
        constWhite: '#f5f8fa',
        twitterLike: '#ff82bc',
        twitterLikeBackground: '#57183599',
        twitterRetweet: '#008559',
        twitterRetweetBackground: '#13aa751a',
        twitterReply:' #4179a9',
        twitterReplyBackground: '#1c455f70',
        twitterShare: '#4179a9',
        twitterShareBackground: '#1c455f70',
        twitterBird:' #f5f8fa',
      },
      screens: {
        'xs': '550',
        'sm': '650px',
        'md': '850px',
        'lg': '1150px',
        'xl': '1300px',
        '2xl': '1536px',
        // Add as many custom screen sizes as you need
      },
    },
  },
  plugins: [],
}
export default config
