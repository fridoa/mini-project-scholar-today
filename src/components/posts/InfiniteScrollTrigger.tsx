import { useEffect, useRef } from "react";
import { usePosts } from "@/hooks/usePosts";

const InfiniteScrollTrigger = () => {
  const { hasNextPage, fetchNextPage, isFetchingNextPage } = usePosts();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isFetchingNextPage || !hasNextPage) return;
        
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "800px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return <div ref={observerTarget} className="h-4" />;
};

export default InfiniteScrollTrigger;
