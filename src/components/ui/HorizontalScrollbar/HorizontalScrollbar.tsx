import { useEffect, useRef, useState } from 'react';
import styles from './HorizontalScrollbar.module.css';

const HorizontalScrollbar = ({ children }: { children: React.ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const [thumbWidth, setThumbWidth] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollStartPosition, setScrollStartPosition] = useState<number>(0);
  const [initialContentScrollLeft, setInitialContentScrollLeft] =
    useState<number>(0);

  const handleResize = () => {
    if (scrollTrackRef.current && contentRef.current) {
      const { clientWidth: trackSize } = scrollTrackRef.current;
      const { clientWidth: contentVisible, scrollWidth: contentTotalWidth } =
        contentRef.current;

      setThumbWidth(
        Math.max((contentVisible / contentTotalWidth) * trackSize, 20),
      );
    }
  };

  const handleThumbPosition = () => {
    if (
      !contentRef.current ||
      !scrollTrackRef.current ||
      !scrollThumbRef.current
    ) {
      return;
    }

    const { scrollLeft: contentLeft, scrollWidth: contentWidth } =
      contentRef.current;
    const { clientWidth: trackWidth } = scrollTrackRef.current;

    let newLeft = (contentLeft / contentWidth) * trackWidth;
    newLeft = Math.min(newLeft, trackWidth - thumbWidth);

    const thumb = scrollThumbRef.current;
    requestAnimationFrame(() => {
      thumb.style.left = `${newLeft}px`;
    });
  };

  useEffect(() => {
    if (contentRef.current) {
      const content = contentRef.current;
      observer.current = new ResizeObserver(() => {
        handleResize();
      });
      observer.current.observe(content);
      content.addEventListener('scroll', handleThumbPosition);
      return () => {
        observer.current?.unobserve(content);
        content.removeEventListener('scroll', handleThumbPosition);
      };
    }
  }, []);

  const handleThumbMousedown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollStartPosition(e.clientX);
    if (contentRef.current)
      setInitialContentScrollLeft(contentRef.current.scrollLeft);
    setIsDragging(true);
  };

  const handleThumbMouseup = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleThumbMousemove = (e: MouseEvent) => {
    if (contentRef.current) {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging) {
        const {
          scrollWidth: contentScrollWidth,
          clientWidth: contentClientWidth,
        } = contentRef.current;

        const deltaX =
          (e.clientX - scrollStartPosition) * (contentClientWidth / thumbWidth);

        const newScrollLeft = Math.min(
          initialContentScrollLeft + deltaX,
          contentScrollWidth - contentClientWidth,
        );

        contentRef.current.scrollLeft = newScrollLeft;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleThumbMousemove);
    document.addEventListener('mouseup', handleThumbMouseup);
    return () => {
      document.removeEventListener('mousemove', handleThumbMousemove);
      document.removeEventListener('mouseup', handleThumbMouseup);
    };
  }, [handleThumbMousemove, handleThumbMouseup]);

  function handleTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const { current: track } = scrollTrackRef;
    const { current: content } = contentRef;
    if (track && content) {
      const { clientX } = e;
      const target = e.target as HTMLDivElement;
      const rect = target.getBoundingClientRect();
      const trackLeft = rect.left;
      const thumbOffset = -(thumbWidth / 2);
      const clickRatio =
        (clientX - trackLeft + thumbOffset) / track.clientWidth;
      const scrollAmount = Math.floor(clickRatio * content.scrollWidth);
      content.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.content}
        id="custom-scrollbars-content"
        ref={contentRef}
      >
        {children}
      </div>
      <div className={styles.scrollbar}>
        <div
          className={styles.trackAndThumb}
          role="scrollbar"
          aria-controls="custom-scrollbars-content"
        >
          <div
            className={styles.track}
            ref={scrollTrackRef}
            onClick={handleTrackClick}
          ></div>
          <div
            className={styles.thumb}
            ref={scrollThumbRef}
            onMouseDown={handleThumbMousedown}
            style={{
              width: `${thumbWidth}px`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollbar;
