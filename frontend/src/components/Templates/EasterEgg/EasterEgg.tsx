import { useSecretShortcut } from '../../../hooks/useKonamiCode';

export default function EasterEgg() {
  useSecretShortcut(() => {
    const audio = new Audio('/Kaz Makłowicz.mp3'); // file in /public folder
    audio.play();
    alert('🎵 Jazda kurwa, kliknij ok bratku i zanurz sie w to');
  });

  return null;
}
