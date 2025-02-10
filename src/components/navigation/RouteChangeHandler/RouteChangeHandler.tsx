'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { endPageLoad } from '../../../utils/navigation';

/**
 * A component that handles the route change.
 * @returns A React component that handles the route change.
 */
const RouteChangeHandlerChild = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    endPageLoad();
  }, [pathname, searchParams]);

  return null;
};

/**
 * A component that handles the route change.
 *
 * `<NavigationEvents>` is wrapped in a `Suspense` boundary because `useSearchParams()` causes client-side rendering up to the closest `Suspense` boundary during static rendering.
 *
 * https://nextjs.org/docs/app/api-reference/functions/use-router#router-events
 * @returns A React component that handles the route change.
 */
const RouteChangeHandler = () => {
  return (
    <Suspense fallback={null}>
      <RouteChangeHandlerChild />
    </Suspense>
  );
};

export default RouteChangeHandler;
