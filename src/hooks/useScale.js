import { useEffect } from 'react';

export const useScale = () => {
    const setScaleToDesign = () => {
        const scale = window.innerWidth / 1512;
        document.documentElement.style.setProperty('--scale', scale);
    };

    useEffect(() => {
        setScaleToDesign();
        window.addEventListener('resize', setScaleToDesign);
        return () => window.removeEventListener('resize', setScaleToDesign);
    }, []);
};