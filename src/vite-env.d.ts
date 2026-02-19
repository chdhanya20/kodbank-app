/// <reference types="vite/client" />

declare module 'canvas-confetti' {
  const confetti: (options?: object) => Promise<null>;
  export default confetti;
}
