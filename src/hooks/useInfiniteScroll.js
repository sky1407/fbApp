import { useEffect, useState } from 'react';

export function useInfiniteScroll({ initialCount = 10, step = 10 } = {}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 100;
      if (nearBottom) setVisibleCount((prev) => prev + step);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [step]);

  return visibleCount;
}
