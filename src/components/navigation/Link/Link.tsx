'use client';

import React, { forwardRef } from 'react';
import NextLink from 'next/link';
import {
  shouldTriggerStartPageLoad,
  startPageLoad,
} from '../../../utils/navigation';

type LinkProps = React.ComponentProps<'a'> & {
  href: string;
  replace?: boolean;
};

/**
 * A component that renders a Next.js Link with a loading state.
 *
 * @param href - The href of the link.
 * @param onClick - The onClick event handler.
 * @param props - The props of the link.
 * @returns A Next.js Link with a loading state.
 */
// eslint-disable-next-line react/display-name
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, onClick, replace, ...props }: LinkProps, ref) => {
    return (
      <NextLink
        href={href}
        replace={replace}
        onClick={event => {
          if (shouldTriggerStartPageLoad(href, event)) startPageLoad();
          if (onClick) onClick(event);
        }}
        {...props}
        ref={ref}
      />
    );
  },
);

export default Link;
