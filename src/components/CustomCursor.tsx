import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBorderRef = useRef<HTMLDivElement>(null);
  const pos = { x: 0, y: 0 };
  const mousePos = { x: 0, y: 0 };

  useEffect(() => {
    if (!cursorRef.current || !cursorBorderRef.current) return;

    document.body.style.cursor = 'none';

    const links = document.querySelectorAll('a, button');
    
    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
      
      gsap.to(cursorBorderRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    const onMouseEnterLink = () => {
      gsap.to(cursorRef.current, {
        scale: 2,
        duration: 0.3,
      });
      gsap.to(cursorBorderRef.current, {
        scale: 2.5,
        duration: 0.3,
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to([cursorRef.current, cursorBorderRef.current], {
        scale: 1,
        duration: 0.3,
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    links.forEach(link => {
      link.addEventListener('mouseenter', onMouseEnterLink);
      link.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      links.forEach(link => {
        link.removeEventListener('mouseenter', onMouseEnterLink);
        link.removeEventListener('mouseleave', onMouseLeaveLink);
      });
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-3 h-3 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={cursorBorderRef}
        className="fixed w-8 h-8 rounded-full border border-white pointer-events-none z-50 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};
