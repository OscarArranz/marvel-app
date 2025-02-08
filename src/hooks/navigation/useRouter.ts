import { useRouter as useNextRouter } from 'next/navigation';
import {
  shouldTriggerStartPageLoad,
  startPageLoad,
} from '../../utils/navigation';
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useMemo } from 'react';

/**
 * A hook that returns a router with a modified push and replace method.
 * This hook allows for a loading state to be set when navigating to a new page.
 *
 * @returns A router with a modified push and replace method.
 */
export const useRouter = (): ReturnType<typeof useNextRouter> => {
  const nextRouter = useNextRouter();

  return useMemo(() => {
    return {
      ...nextRouter,
      push: (href: string, options?: NavigateOptions) => {
        if (shouldTriggerStartPageLoad(href)) startPageLoad();
        nextRouter.push(href, options);
      },
      replace: (href: string, options?: NavigateOptions) => {
        if (shouldTriggerStartPageLoad(href)) startPageLoad();
        nextRouter.replace(href, options);
      },
    };
  }, [nextRouter]);
};
