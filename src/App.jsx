import React from 'react';
import CanvasDrawingApp from './components/component/playground';
import Apology from './components/component/apology';

const isDesktop = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|tablet|touch|samsung|fridge/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 1024;
    return !isMobile && !isSmallScreen;
};

function App() {
    if (!isDesktop()) {
        return <Apology />
    }
    else {
        return (
            <CanvasDrawingApp />
        )
    }
}

export default App