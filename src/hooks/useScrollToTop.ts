import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

interface OutletContextType {
  mainRef: React.RefObject<HTMLDivElement>;
}

const useScrollToTop = () => {
  const { mainRef } = useOutletContext<OutletContextType>();

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [mainRef]);
};

export default useScrollToTop;
