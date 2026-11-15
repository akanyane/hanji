// Self-hosted fonts (unicode-range subsets: only the glyphs in use are
// downloaded). Imported lazily from main.tsx so their ~400 @font-face rules
// (most of the CSS) don't block the first paint; text shows in the system
// font and swaps when these arrive (font-display: swap).
//
// Latin (with accents) comes from IBM Plex Sans, Hangul from its KR sibling.
// Hangul only has 400 and 700: each weight adds ~90 @font-face rules, and
// 500/600 text uses the nearest weight.
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-sans-kr/400.css'
import '@fontsource/ibm-plex-sans-kr/700.css'
import '@fontsource/gowun-batang/400.css'
import '@fontsource/gowun-batang/700.css'
