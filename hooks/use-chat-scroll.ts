import { useEffect, useState } from "react";

type chatScrollProps = {
  ref: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  bottomRef,
  count,
  loadMore,
  ref,
  shouldLoadMore,
}: chatScrollProps) => {
  const [hasInitalized, sethasInstialized] = useState(false);

  useEffect(() => {
    const topDiv = ref?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, ref]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = ref?.current;
    const shouldAutoScroll = () => {
      if (!hasInitalized && bottomDiv) {
        sethasInstialized(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, ref , count , hasInitalized]);
};
