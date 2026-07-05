'use client';

import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    const loadGsap = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // 3D flip-up entrance for all glass cards
      const cards = document.querySelectorAll('[data-animate-card]');
      cards.forEach((card) => {
        const el = card as HTMLElement;
        const rect = el.getBoundingClientRect();
        // Skip cards already in viewport on load
        if (rect.top < window.innerHeight) return;

        const wrapper = document.createElement('div');
        wrapper.style.willChange = 'transform';
        el.parentNode?.insertBefore(wrapper, el);
        wrapper.appendChild(el);

        gsap.fromTo(wrapper,
          {
            rotationX: -25,
            y: 80,
            opacity: 0,
            transformPerspective: 700,
            transformOrigin: 'center bottom',
          },
          {
            rotationX: 0,
            y: 0,
            opacity: 1,
            transformPerspective: 700,
            transformOrigin: 'center bottom',
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 100%',
              end: 'top 55%',
              scrub: 0.4,
            },
          }
        );
      });

      // 3D tilt on hover for cards — uses GSAP to avoid transform conflicts
      const tiltCards = document.querySelectorAll('[data-tilt]');
      tiltCards.forEach((card) => {
        const el = card as HTMLElement;
        let raf: number;

        el.addEventListener('mousemove', (e: MouseEvent) => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(el, {
              rotationY: x * 6,
              rotationX: -y * 6,
              transformPerspective: 1000,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          });
        });

        el.addEventListener('mouseleave', () => {
          cancelAnimationFrame(raf);
          gsap.to(el, {
            rotationY: 0,
            rotationX: 0,
            transformPerspective: 1000,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      });

      // Parallax float — elements inside sections drift at different speeds
      const floatEls = document.querySelectorAll('[data-float]');
      floatEls.forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.float || '1');
        gsap.to(el, {
          y: -40 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3,
          },
        });
      });

      // Staggered entrance for grid children
      const grids = document.querySelectorAll('[data-stagger-children]');
      grids.forEach((grid) => {
        const children = Array.from(grid.children);
        // Only animate if not already in viewport
        const rect = grid.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
          gsap.set(children, { y: 40, opacity: 0, scale: 0.97 });
          ScrollTrigger.create({
            trigger: grid,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(children, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
              });
            },
          });
        }
      });
    };

    loadGsap();
  }, []);

  return null;
}
