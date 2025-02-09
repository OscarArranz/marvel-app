import { SVGProps, memo } from 'react';

interface HeartIconProps extends SVGProps<SVGSVGElement> {
  height?: number;
  width?: number;
}

const HeartIcon = ({
  fill = '#EC1D24',
  height = 22,
  width = 24,
  className,
  ...props
}: HeartIconProps) => (
  <svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 13 12"
    className={className}
    {...props}
  >
    <path
      fill="#EC1D24"
      fillRule="evenodd"
      d="m6.572 2.373-3-1.82-3 1.82v3.902l6 5.115 6-5.115V2.373l-3-1.82-3 1.82Z"
      clipRule="evenodd"
    />
  </svg>
);

export default memo(HeartIcon);
