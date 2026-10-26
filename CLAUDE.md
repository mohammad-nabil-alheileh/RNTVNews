# TV News Reader

A news reader for the TV, used only with the remote. Users browse stories by category, read articles and save stories for later. Requirements come from the project checklist "Project: TV News Reader" (39 items in 7 sections). An item counts as done only when it works on **both** targets, tested on a real TV where possible.

## Targets

| Target | How it runs | Oldest supported |
|---|---|---|
| Android TV | Native app (React Native, react-native-tvos) | — |
| LG webOS | Web build (react-native-web + webpack), packaged as `.ipk` | **webOS 22 = Chromium 87** |

There is no Samsung Tizen and no Apple TV target, so there is no `ios/` folder.

## Stack

- **React Native CLI + TypeScript.** `react-native` is aliased to `react-native-tvos@0.83.0-0` in `package.json`, which adds TV focus and remote support (`hasTVPreferredFocus`, `useTVEventHandler`, `TVFocusGuideView`).
- **Web:** `react-native-web` renders the same components as HTML. Webpack bundles them (`webpack.config.js`).
- **Navigation:** React Navigation 7 native stack (`@react-navigation/native-stack` + `react-native-screens`), set up in `App.tsx`, no header, no animation. Every screen is wrapped in `ErrorBoundary` via `screenLayout`, so a crash shows an error state with "Try again" instead of killing the app; wrap risky parts inside a screen (e.g. each Home row) in their own `ErrorBoundary` too. Screens and their params are listed in `src/types/navigation.ts`; screens type their props as `ScreenProps<'Name'>`. No `linking` config, so it never touches browser history (webOS has it turned off). Webpack needs `resolve.fullySpecified: false` for its `.js` files, and Jest's `transformIgnorePatterns` must include `@react-navigation` and `react-native-screens`.
- **Babel:** Android uses `babel.config.js` (Metro). The web build ignores that file and sets its own Babel options inside `webpack.config.js` (it also converts class fields, so the bundle passes the ES2021 check). Keep the `@babel/*` packages on **version 7**, because React Native needs Babel 7.

## Commands

| Goal | Command |
|---|---|
| Develop in a desktop browser | `npm run web`, then open http://localhost:8080 |
| Run on Android TV (emulator or `adb connect <ip>:5555`) | `npm start` + `npm run android` |
| Build web only | `npm run build:web` (output in `dist/`; fails if the bundle uses syntax newer than ES2021, the newest level Chromium 87 fully supports) |
| Build, package, install and launch on LG TV | `npm run webos` |
| Debug on LG TV (Chrome DevTools) | `npm run webos:debug` |
| Type check / tests / lint | `npm run typecheck` / `npm test` / `npm run lint` |
| Format code (project Prettier style, e.g. `import { View }` with spaces) | `npx prettier --write "src/**/*.{ts,tsx}"` |

**LG TV setup (once per TV):** install the Developer Mode app on the TV and turn it on, then run `ares-setup-device` (name `tv`, port 9922, user `prisoner`) and `ares-novacom --device tv --getkey`.

## Folder structure

```
index.js           Android entry
index.web.tsx      Web (webOS) entry
src/
  App.tsx          Root component
  screens/         One folder per screen with its files: HomeScreen/HomeScreen.tsx + HomeScreen.styles.ts, CategoryScreen/CategoryScreen.tsx, ...
  components/      Every component, each a folder with its sub-components inside
    TopStory/            TopStory.tsx + TopStory.styles.ts + TopStory.types.ts
    CategoryTabs/
      CategoryTabs.tsx
      CategoryTabs.styles.ts
      CategoryTabs.types.ts
      components/
        Tab/             Tab.tsx + Tab.styles.ts + Tab.types.ts
    SearchKeyboard/components/Key/
    SavedList/components/SavedItem/
    shared/              Components used by 2+ screens: StoryCard/, FocusableButton/, StatusView/, ErrorBoundary/, FocusGroup/, MainLayout/ (menu bar + screen content; its NavBar lives in MainLayout/components/NavBar/)
    ArticleActions/      Back / Save / Next story column of the Article screen
    ArticleBody/         Virtualized article list (FlatList); components/BodyItem/ is one focusable, memoized item showing ArticleHeader, TextBlock or ImageBlock
  theme/theme.ts   Root design values for the whole app: colors, spacing, safeArea (overscan margins: keep important content inside), radius, fontSize, lineHeight, focus, isRTL
  types/           Types shared across the app: story.ts (Story, Article, ArticleBlock, LoadState), layout.ts (SectionLayout), language.ts (Language, LanguageContextValue), api.ts (ApiErrorKind), devto.ts (raw API), navigation.ts, assets.d.ts (.woff2)
  hooks/           Shared hooks, one folder each (useLoad/useLoad.ts, useCenteredRail/useCenteredRail.ts + .types.ts, ...): useLoad (runs a fetch, returns LoadState + reload; pass it a stable function, e.g. from useCallback), useCenteredRail (center-locked horizontal rows), useCenteredScroll (centers the focused section of a ScrollView), useCenteredList (centers the focused item of a vertical FlatList, or aligns it to the top if it is taller than the screen; put its `Cell` on `CellRendererComponent` so it can record each item's position)
  i18n/            Current language (language.ts: LanguageContext, useLanguage, useSetLanguage), formatShortDate (formatDate.ts) and, later, translations
  api/             Home/Category tag list (categories.ts: webdev, javascript, python, ai, career), dev.to client (devto.ts), image sizing (devtoImage.ts: `sizedImageUrl` asks dev.to's resizer for the exact pixel size an image is shown at, so weak TVs download and decode less), article body parser (articleBody.ts: turns `body_html` into `ArticleBlock`s — heading, paragraph, listItem, quote, code split into 12-line chunks, table rows as `cell · cell`, and article images with their width/height ratio; dev.to logos, avatars, icons and embed cards are dropped), store of every story loaded so far (storyStore.ts: getStory, getAllStories; filled by devto.ts), custom search over that store (search.ts)
  platform/        Everything that differs between Android and webOS, one folder per module: back/back.ts + back.web.ts, focusGuide/, fonts/, preferredFocus/ (on webOS marks `hasTVPreferredFocus` items with `data-preferred-focus` so the engine focuses them when a screen opens), smoothScroll/ (scrollListTo / scrollViewTo: native smooth scroll on Android, our 180 ms ease-out animation on webOS because the browser smooth scroll takes ~300 ms and feels laggy), spatialNavigation/, textDirection/
webos/             appinfo.json and icons, copied into dist/ on build
```

**Component-based structure.** Screens in `src/screens/<Name>Screen/` only arrange components and import them from `../../components/<Name>/<Name>`; a screen folder holds the screen and its own files (e.g. `HomeScreen.styles.ts`). Every component is a folder in `src/components/` with `Name.tsx` (named export), `Name.styles.ts` and `Name.types.ts`. There are no `index.ts` files: always import the file itself, never a folder. A component's sub-components go in a `components/` folder inside it, at any depth (e.g. `SearchKeyboard/components/Key/`), and only that parent imports them. Components used by more than one screen go in `src/components/shared/`. Every main screen (Home, Category, Search, Saved, Settings) wraps its content in `MainLayout current="..."` so the menu bar is always reachable, in every state; Article stays full screen. Menu navigation: from Home it pushes the section, between sections it replaces, and Home pops back, so Back from any section returns to Home and then to the exit dialog.

**Types.** Types used in more than one place go in `src/types/`. Each component's own props go in `Name.types.ts` in its folder (shared components too), and the same for hooks (e.g. `hooks/useCenteredRail/useCenteredRail.types.ts`), written as an `interface` (e.g. `export interface FocusableButtonProps`); `Name.tsx` imports it. Components use the app's `Story`/`Article` types, never the raw `DevtoArticle`; only `api/devto.ts` touches that.

## Rules

1. **Keep platform differences in `src/platform/` only.** Write `name.ts` for Android and `name.web.ts` for webOS. Webpack picks `.web.ts` first and Metro picks `.ts`, so each module is a folder `platform/name/` holding `name.ts` and `name.web.ts`, and code imports `.../platform/name/name` (e.g. `platform/back/back`). Screens never check the platform themselves (checklist item 6.1).
2. **Web code must run on Chromium 87.** Babel and `core-js` handle JavaScript syntax and most missing functions. CSS features are not polyfilled, so don't rely on CSS `aspect-ratio` (added in Chrome 88), `:has()` or container queries. Use fixed sizes or the padding trick for image boxes.
3. **Back key:** listen only through `onBack(handler)` from `platform/back/back` (Android hardware Back; webOS key code `461`, since `appinfo.json` sets `disableBackHistoryAPI: true`; Escape in the desktop browser). The newest listener runs first; return `true` when handled. Register it in a `useEffect` and return its cleanup. App's listener goes back one screen, or on Home opens `ExitDialog` (focus starts on "Stay"; Back closes it, so a quick double Back never exits). Dialogs use RN `Modal` (traps focus on both targets) and also pass `onRequestClose`, which is how Android delivers Back to an open Modal.
4. **Styles live in their own file.** Each component has `Name.styles.ts` exporting `makeStyles = (theme: Theme) => StyleSheet.create({...})`, and `Name.tsx` calls `const styles = useStyles(makeStyles)` (from `src/theme/theme`). Styles never use raw colors or sizes; they take them from the theme. The screen width is read once at startup (`Dimensions.get` in `theme.ts`; a TV screen never resizes, so there is no live resize handling, and resizing the desktop browser needs a reload). The theme is rebuilt only when the language changes (`useLanguage`), which is why styles still go through `useStyles(makeStyles)`. Every `Text` style sets `fontFamily` from the theme, and `lineHeight` from `theme.lineHeight` next to its `fontSize`. Font: Android uses the system font (it covers Arabic). webOS uses the LG system font (`LG Smart UI`) first, with a bundled Noto Sans Arabic (`@fontsource/noto-sans-arabic`, Arabic letters only, see `platform/fonts/fonts.web.ts`) as fallback. Line heights matter because Arabic needs taller lines (1.6× vs 1.3×) or its letters get clipped. Use `theme.isRTL` only for things start/end can't flip, such as mirroring an arrow icon. Sizes are written in 1920x1080 design pixels; any size not already in the theme (e.g. a card width) goes through `theme.scale()`, so it fits 720p, 1080p and 4K and both Android (~960 wide) and webOS (1920 or 1280 wide). (These are React Native style objects, not CSS. react-native-web turns them into CSS on webOS.)
5. **Use logical styles** (`marginStart`/`marginEnd`, not left/right), so the Arabic right-to-left layout works.
6. **Focus: wrap every set of focusable items in `FocusGroup`** (`components/shared/FocusGroup`). `remember` returns focus to the last focused item when coming back (first item on the first visit); `trap={['left','right','up','down']}` stops focus leaving in those directions. Use `remember` + `trap={['left','right']}` for every horizontal row, and make it center-locked with `useCenteredRail` (`hooks/useCenteredRail`: pass the card width, gap and start padding, put `listRef`/`onLayout` on the FlatList and call `centerOn(index)` from each card's `onFocus`; focus moves until the card reaches the middle, then the row slides under it), and trap the sides of anything with nothing beside it (e.g. the top story). Android uses `TVFocusGuideView` (`autoFocus`, `trapFocus*`); webOS uses our arrow-key engine in `platform/spatialNavigation` (started once in App), which reads the same settings from `data-focus-*` attributes, only counts an item as being in the pressed direction if it is clearly there (by at least 25% of its size, so a focused card scaled up next to its neighbours never makes Up/Down pick a neighbour in the same row), leaves scrolling to the centering hooks (it only scrolls an item into view itself if it is still off-screen 250 ms after focusing), keeps focus inside open dialogs, and when focus is lost (Back from a screen, a dialog closing, an item disappearing) returns it to the most recently focused item that is still visible, falling back to the first item. This is how webOS matches Android, which restores focus natively. On Android `FocusGroup` is a `TVFocusGuideView`, and a `flex: 1` child inside it collapses to 1 px; give such children (e.g. a FlatList) `height: '100%'` and the group itself a definite height. To debug focus on Android, log in `onFocus` and read `adb logcat -s ReactNativeJS`; emulator screenshots can lag behind the real focus.

## Data: dev.to (Forem) API

Open source, free, no API key, and it allows requests from the browser (CORS).

- Category row: `https://dev.to/api/articles?tag=<tag>&per_page=30`
- Top stories for Home: `https://dev.to/api/articles?top=7`
- Full article (`body_html`): `https://dev.to/api/articles/<id>`

**Search is custom.** dev.to has no public search endpoint. Search the articles already loaded (title > tags > description), wait about 250 ms after each key press, and lowercase the text. For Arabic, remove vowel marks and treat أ/إ/آ as ا. If the search word is a tag name, also fetch that tag.

**Arabic:** translate all app text, use right-to-left layout, swap the left/right focus direction, and format dates and numbers with `Intl.*('ar')`. Use `dir="auto"` on headlines and article text: spread `{...autoDirection}` from `platform/textDirection/textDirection` onto the `Text` (adds `dir="auto"` on webOS; Android detects direction by itself). Other articles stay in English.

**Article screen.** Full screen, no menu: a fixed action column on the left (Back, Save, Next story) and the article on the right as a virtualized FlatList (`initialNumToRender` 6, `windowSize` 5), one focusable block per heading/paragraph/list item/quote/code chunk/image, so Up/Down reads block by block (centered) and Left reaches the actions from any position. The header (title, meta, cover) is the first block and gets focus first; it shows right away from `storyStore` while the body loads. Every image box is sized before it loads (cover 1000:420, body images from their width/height, else 16:9, capped at 640 design px tall), so nothing moves. Next story follows the `queue` param (ids of the row the story was opened from) and uses `replace`, so Back always returns to where the reader started.

## Status

- **Done:** project created; web build works and renders from `file://`; bundle checked against ES2021 on every `build:web` (`es-check`); React Navigation set up with placeholder screens; webOS `.ipk` packages successfully; typecheck, tests and lint pass.
- **Android:** builds and runs on the `Television_1080p` emulator (first build ~7 min). Run `npm start`, then `npx react-native run-android --no-packager` (plain `npm run android` tries to start a second Metro and quits). `react-native-screens` is pinned to `~4.25.0` because 4.26+ needs RN 0.84; `.npmrc` sets `legacy-peer-deps=true` because npm treats `react-native-tvos@0.83.0-0` as a pre-release older than 0.82. If the emulator shows "No connection" while the laptop is online, check `adb shell date`: a restored snapshot can leave the clock days behind and break HTTPS; cold boot it (`emulator -avd Television_1080p -no-snapshot-load`) and run `adb reverse tcp:8081 tcp:8081`.
- **Next:** remote and focus handling (spatial navigation for web), then the screens.
