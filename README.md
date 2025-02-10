This project is a web application that allows the user to search marvel characters, save favorite characters and check a character's details and the comic's where it appears.

## Getting started

In order to get the project up and running, clone this repo and execute `npm install` in your terminal.

After installing the dependencies with npm, you can run `npm run dev` to start the development server. The website will be accesible at localhost:3000.

If you need to build the project, run `npm run build` in your terminal.

This project is using vitest for unit testing, to run the tests run `npm run test` in your terminal.

## Project structure

The project uses Next.js 15 and its app router. There are only two pages the index at `/` and the character page, which is a dynamic route at `/character/{characterName}`. Routes are defined as per Next.js App Router specification inside the `/src/app` folder.

There are two API routes, one to fetch multiple characters (allowing to filter by matching a string with the start of the name of a character) at `/api/characters` and a dynamic one that allows to fetch a specific character at `/api/characters/{characterName}`.

The React components of the project that could be shared across different parts of the app are located inside `/src/components/`, while page specific components are located in a `components` folder in the same directory as the `page.tsx` file of the page. Components are always kept inside a folder with the component's name, inside of it there will be an `index.ts` that exports the component and a `ComponentName.tsx` file that exports the component that is imported and then re-exported inside `index.ts`. Additionally, a component can also have a `ComponentName.module.css` file with its static styles.

There is a `/src/context` folder with a `SearchContext.tsx` file that export the SearchContext, which keeps the state of the index's page search. In this particular instance, using prop drilling might have been more appropriate as the level of nesting of the components is not very high, however, a context has been created for demonstration of its use.

There is also a `/src/hooks` folder that contains different custom hooks used in the application. The hooks inside `/src/hooks/browser` as well as `/src/hooks/useIsomorphicLayoutEffect.ts` come from [usehooks-ts](https://github.com/juliencrn/usehooks-ts), all other hooks are custom made.

Finally, there is a folder `/src/utils` with utilities used across the app. Inside, there is a `server` folder with utilities used server side, a `constants.ts` that defines several constants used across the app and a `navigation` folder with utilities for the page load progress bar.

### Interesting bits

As a part of the `Navbar` component, there is a `ProgressBar` component. In order to make this component work, there is a custom store inside `/src/utils/navigation/index.ts` that keeps the state of the page (either `idle` or `loading`). There is also a custom `useRouter` hook that wraps Next's `useRouter` hook, providing the ability to set the `'loading'` state inside the navigation store. There also exists a `Link` component that extends Next's `Link` component with the same functionality. Additionally, there is a `RouteChangeHandler` component placed in the root layout that allows listening for route changes to correctly signal the navigation store (and it's subscribers) that the page load has finished. Finally, the `ProgressBar` component situated at `/src/app/components/ui/Navbar/components/ProgressBar` subscribes to the navigation store and animates the page load.

Another interesing component is `HorizontalScrollbar`, located at `/src/components/ui/HorizontalScrollbar`. This component wraps some content that overflows horizontally and renders a custom scrollbar that works similarly to the browser's native scrollbar (it' thumb can be dragged to scroll and clicks on the track will also change the scroll position). It works by calculating the thumb's width based on the content's total width and visible width, and listens to the content's `scroll` event to calculate the thumb's position. It also works the other way, listening the position of the mouse after the thumb's has been clicked to alter the amount of scrolling of the content.

The `localStorage` browser API has been used to save the favorite characters of the user.

### Possible improvements

1. Lots of css properties such as paddings, margins, gap distances, etc, could be extracted into css variables just as the colors are.
2. Lifting the state on the `SearchBar` and `CharactersGrid` components and prop drilling is probably a better way of handling that particular piece of state, since there isn't much nesting to justify using context.
3. With some kind of authentication (using the `next-auth` package, for example) the favorited characters of an user could be saved server-side inside a database, allowing users to access and update their favorite characters from different devices.
5. Error boundaries could be implemented to wrap components that might throw.
6. A Not Found page could be implemented for the website, and specially for not found characters.
