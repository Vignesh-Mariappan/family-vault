import { useState, useEffect } from "react";


const useGetAppTheme = () => {
  const [isDark, setIsDark] = useState(false);
  
    useEffect(() => {
        const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

export default useGetAppTheme;