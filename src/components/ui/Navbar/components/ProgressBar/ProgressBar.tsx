'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styles from './ProgressBar.module.css';
import { navigationStore } from '../../../../../utils/navigation';

const MAX_PROGRESS = 100;
const MIN_PROGRESS = 0;
const INITIAL_PROGRESS = 25;
const ANIMATION_DURATION = 2000; // 2 seconds total for loading animation
const COMPLETION_DURATION = 300; // Duration for the completion animation

/**
 * A component that displays a progress bar that animates when the page is loading.
 *
 * @returns A React component that displays a progress bar.
 */
const ProgressBar = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(MIN_PROGRESS);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const navigationState = useSyncExternalStore(
    navigationStore.subscribe,
    navigationStore.getSnapshot,
  );

  useEffect(() => {
    // Skip the first loading state
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    let rafId: number;
    let startTime: number;

    const updateProgress = (progress: number, opacity: number) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
        progressBarRef.current.style.opacity = opacity.toString();
        progressRef.current = progress;
      }
    };

    const animate = (timestamp: number) => {
      // If the animation is not started, grab the current time
      if (!startTime) startTime = timestamp;

      // Calculate the elapsed time
      const elapsed = timestamp - startTime;

      // If the navigation state is loading, calculate the progress
      if (navigationState === 'loading') {
        const progress = Math.min(
          90,
          INITIAL_PROGRESS + (65 * elapsed) / ANIMATION_DURATION,
        );
        updateProgress(progress, 1);
        rafId = requestAnimationFrame(animate);
      }
    };

    const completeProgress = (timestamp: number) => {
      // If the animation is not started, grab the current time
      if (!startTime) startTime = timestamp;

      // Calculate the elapsed time
      const elapsed = timestamp - startTime;

      // Calculate the progress
      const progress = Math.min(
        MAX_PROGRESS,
        progressRef.current +
          ((MAX_PROGRESS - progressRef.current) * elapsed) /
            COMPLETION_DURATION,
      );

      updateProgress(progress, 1);

      if (progress < MAX_PROGRESS) {
        rafId = requestAnimationFrame(completeProgress);
      } else {
        // Fade out and reset
        setTimeout(() => {
          if (progressBarRef.current) {
            progressBarRef.current.style.opacity = '0';

            // After the opacity transition, reset the progress and opacity
            setTimeout(() => {
              updateProgress(MIN_PROGRESS, 1);
            }, 300);
          }
        }, 200);
      }
    };

    if (navigationState === 'loading') {
      // Reset and start loading animation
      updateProgress(MIN_PROGRESS, 1);
      startTime = 0;
      rafId = requestAnimationFrame(animate);
    } else if (navigationState === 'idle') {
      // Complete the progress
      startTime = 0;
      rafId = requestAnimationFrame(completeProgress);
    }

    return () => {
      // Cancel the ongoing animation
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [navigationState]);

  return (
    <div
      className={styles.progressBarContainer}
      role="progressbar"
      aria-label="Page navigation progress"
      aria-valuemin={MIN_PROGRESS}
      aria-valuemax={MAX_PROGRESS}
      aria-valuenow={progressRef.current}
    >
      <div ref={progressBarRef} className={styles.progressBar} />
    </div>
  );
};

export default ProgressBar;
