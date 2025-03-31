import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { Code, User, Briefcase, Mail } from 'lucide-react';

// Lazy load components that aren't immediately needed
const Scene = lazy(() => import('./components/Scene').then(mod => ({ default: mod.Scene })));
const BackgroundEffect = lazy(() => import('./components/BackgroundEffect').then(mod => ({ default: mod.BackgroundEffect })));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "About",
      icon: <User className="w-6 h-6" />,
      content: "Creative developer passionate about building immersive digital experiences"
    },
    {
      title: "Skills",
      icon: <Code className="w-6 h-6" />,
      content: "Expertise in React, Three.js, WebGL, and Creative Development"
    },
    {
      title: "Work",
      icon: <Briefcase className="w-6 h-6" />,
      content: "Creating innovative solutions for forward-thinking clients"
    },
    {
      title: "Contact",
      icon: <Mail className="w-6 h-6" />,
      content: "Let's create something amazing together"
    }
  ];

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaX > 50) {
        setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
      } else if (e.deltaX < -50) {
        setCurrentSection(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [sections.length]);

  return (
    <>
      <CustomCursor />
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      
      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <BackgroundEffect />
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <motion.div 
        className="fixed inset-0 flex items-center"
        animate={{ x: `${-currentSection * 100}vw` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="w-screen h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: currentSection === index ? 1 : 0.3, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-6">
                {section.icon}
              </div>
              <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
              <p className="text-xl max-w-md">{section.content}</p>
            </motion.div>
          </div>
        ))}
      </motion.div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              currentSection === index ? 'bg-white' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentSection(index)}
          />
        ))}
      </div>
    </>
  );
}

export default App;
