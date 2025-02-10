import { addBasePath } from 'next/dist/client/add-base-path';

type NavigationState = 'idle' | 'loading';

let state: NavigationState = 'idle';
const listeners: Map<symbol, () => void> = new Map();

/**
 * A store that manages the navigation state.
 *
 * @returns A store that manages the navigation state.
 */
const navigationStore = {
  /**
   * A function that subscribes to the navigation state.
   *
   * @param listener - A function that will be called when the navigation state changes.
   * @returns A cleanup function to remove the listener.
   */
  subscribe: (listener: () => void): (() => void) => {
    const id = Symbol();
    listeners.set(id, listener);
    return () => {
      listeners.delete(id);
    };
  },

  /**
   * A function that returns the current navigation state.
   *
   * @returns The current navigation state.
   */
  getSnapshot: (): NavigationState => {
    return state;
  },

  /**
   * A function that returns the current navigation state in the server.
   *
   * @returns The current navigation state.
   */
  getServerSnapshot: (): NavigationState => {
    return state;
  },

  /**
   * A function that sets the navigation state.
   *
   * @param newState - The new navigation state.
   */
  setState: (newState: NavigationState): void => {
    state = newState;
    listeners.forEach(listener => listener());
  },
};

/**
 * A function that builds a URL from a href.
 * @param href - The href to build the URL from.
 * @returns The built URL.
 */
const buildURL = (href: string) => {
  return new URL(addBasePath(href), location.href);
};

/**
 * A function that checks if an event is a modified event.
 *
 * @param event - The event to check.
 * @returns True if the event is a modified event, false otherwise.
 */
const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) => {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
  const target = eventTarget.getAttribute('target');

  return (
    (target && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (event.nativeEvent && event.nativeEvent.button === 1)
  );
};

/**
 * A function that checks if the start page load should be triggered.
 *
 * @param href - The href to check.
 * @param event - The event to check.
 * @returns True if the start page load should be triggered, false otherwise.
 */
const shouldTriggerStartPageLoad = (
  href: string,
  event?: React.MouseEvent<HTMLAnchorElement>,
) => {
  const currentLocation = window.location;
  const targetLocation = buildURL(href);

  // If the event is a modified event, do not trigger the start page load
  if (event && isModifiedEvent(event)) return false;

  // If the target location is an external link, do not trigger the start page load
  if (currentLocation.origin !== targetLocation.origin) return false;

  // If the current location is the same as the target location, do not trigger the start page load
  // If we checked currentLocation.search === targetLocation.search, we will trigger the start page load
  // when the search params are different.
  if (currentLocation.pathname === targetLocation.pathname) {
    return false;
  }

  return true;
};

/**
 * A function that starts the page load.
 */
const startPageLoad = () => {
  navigationStore.setState('loading');
};

/**
 * A function that ends the page load.
 */
const endPageLoad = () => {
  navigationStore.setState('idle');
};

export {
  shouldTriggerStartPageLoad,
  startPageLoad,
  endPageLoad,
  navigationStore,
};
