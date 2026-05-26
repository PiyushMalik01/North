/**
 * Animation Configuration
 * Centralized settings for logo animation behavior
 */

export const ANIMATION_CONFIG = {
  /**
   * Controls when the logo animation plays on the landing page
   * 
   * false: Animate on every page reload (current behavior)
   * true: Animate only once per browser session
   * 
   * Note: "Session" means until the browser tab/window is closed
   */
  animateOncePerSession: false,

  /**
   * Animation duration in milliseconds
   * Default: 2000 (2 seconds)
   */
  duration: 2000,

  /**
   * Starting position offset (in em units)
   * Default: -2.6em (penguin starts 2.6em to the left)
   */
  startPositionX: -2.6,

  /**
   * Animation easing function
   * Options: 'ease-out', 'ease-in', 'ease-in-out', 'linear', or custom cubic-bezier
   */
  easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

export const GSAP_DEFAULTS = {
  ease: {
    enter: 'power3.out',
    move: 'power2.inOut',
    exit: 'power2.in',
  },
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.7,
  },
  stagger: {
    fast: 0.06,
    normal: 0.12,
    slow: 0.2,
  },
  scrollTrigger: {
    start: 'top 85%',
    toggleActions: 'play none none none' as const,
  },
} as const;
