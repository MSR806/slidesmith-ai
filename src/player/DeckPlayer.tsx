import { useEffect, useMemo, useRef, useState } from 'react';
import { ProgressBar } from '../components/ProgressBar';
import type { Deck } from '../decks/types';

function readSlideFromHash(deck: Deck): number {
  // Expected hash: #/<deckId>/<slideNumber>
  const parts = window.location.hash.replace(/^#\/?/, '').split('/');
  if (parts[0] === deck.id) {
    const parsed = Number(parts[1]);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= deck.slides.length) {
      return parsed - 1;
    }
  }
  return 0;
}

type DeckPlayerProps = {
  deck: Deck;
  onExit: () => void;
};

export function DeckPlayer({ deck, onExit }: DeckPlayerProps) {
  const interactiveStepCounts = deck.interactiveStepCounts ?? {};
  const isExporting = useMemo(
    () => new URLSearchParams(window.location.search).has('export'),
    [],
  );

  const [currentSlide, setCurrentSlide] = useState(() => readSlideFromHash(deck));
  const [slideStep, setSlideStep] = useState(0);
  const [laserEnabled, setLaserEnabled] = useState(false);
  const [laserPressed, setLaserPressed] = useState(false);
  const laserEnabledRef = useRef(laserEnabled);
  const laserPressedRef = useRef(laserPressed);
  const laserTraceRef = useRef<SVGSVGElement>(null);
  const lastTracePointRef = useRef<{ x: number; y: number } | null>(null);
  const lastTraceMidpointRef = useRef<{ x: number; y: number } | null>(null);
  const lastTraceAtRef = useRef(0);
  const Slide = useMemo(() => deck.slides[currentSlide], [deck, currentSlide]);
  const Background = deck.Background;

  const goToSlide = (slide: number, step = 0) => {
    setCurrentSlide(slide);
    setSlideStep(step);
  };

  const goNext = () => {
    const stepCount = interactiveStepCounts[currentSlide];
    if (stepCount && slideStep < stepCount - 1) {
      setSlideStep((step) => step + 1);
      return;
    }
    goToSlide(Math.min(currentSlide + 1, deck.slides.length - 1));
  };

  const goPrevious = () => {
    if (interactiveStepCounts[currentSlide] && slideStep > 0) {
      setSlideStep((step) => step - 1);
      return;
    }
    const previousSlide = Math.max(currentSlide - 1, 0);
    const previousStepCount = interactiveStepCounts[previousSlide];
    goToSlide(previousSlide, previousStepCount ? previousStepCount - 1 : 0);
  };

  // Keep the hash in sync with the current slide.
  useEffect(() => {
    const nextHash = `#/${deck.id}/${currentSlide + 1}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
  }, [deck.id, currentSlide]);

  // React to manual hash edits / browser nav within this deck.
  useEffect(() => {
    const onHashChange = () => setCurrentSlide(readSlideFromHash(deck));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [deck]);

  useEffect(() => {
    laserEnabledRef.current = laserEnabled;
  }, [laserEnabled]);

  useEffect(() => {
    laserPressedRef.current = laserPressed;
  }, [laserPressed]);

  useEffect(() => {
    if (!deck.enableLaser) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const addLaserTrace = (event: PointerEvent) => {
      const trace = laserTraceRef.current;
      const previousPoint = lastTracePointRef.current;
      const now = performance.now();
      const nextPoint = { x: event.clientX, y: event.clientY };

      if (!trace) return;

      if (!previousPoint) {
        lastTracePointRef.current = nextPoint;
        return;
      }

      if (now - lastTraceAtRef.current < 16) return;

      lastTraceAtRef.current = now;

      const midpoint = {
        x: (previousPoint.x + nextPoint.x) / 2,
        y: (previousPoint.y + nextPoint.y) / 2,
      };
      const startPoint = lastTraceMidpointRef.current ?? previousPoint;
      const segment = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      segment.setAttribute('class', 'laser-trace-segment');
      segment.setAttribute(
        'd',
        `M ${startPoint.x.toFixed(1)} ${startPoint.y.toFixed(1)} Q ${previousPoint.x.toFixed(1)} ${previousPoint.y.toFixed(1)} ${midpoint.x.toFixed(1)} ${midpoint.y.toFixed(1)}`,
      );
      trace.appendChild(segment);
      lastTracePointRef.current = nextPoint;
      lastTraceMidpointRef.current = midpoint;

      window.setTimeout(() => segment.remove(), 760);
    };

    const onPointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--laser-x', `${event.clientX.toFixed(0)}px`);
      document.documentElement.style.setProperty('--laser-y', `${event.clientY.toFixed(0)}px`);

      if (laserEnabledRef.current || laserPressedRef.current) {
        addLaserTrace(event);
      }

      if (reducedMotion.matches) return;

      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--constellation-parallax-x', `${(x * 18).toFixed(2)}px`);
        document.documentElement.style.setProperty('--constellation-parallax-y', `${(y * 14).toFixed(2)}px`);
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      lastTracePointRef.current = { x: event.clientX, y: event.clientY };
      lastTraceMidpointRef.current = null;
      onPointerMove(event);
      setLaserPressed(true);
    };

    const onPointerUp = () => {
      lastTracePointRef.current = null;
      lastTraceMidpointRef.current = null;
      setLaserPressed(false);
    };

    const onDoubleClick = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--laser-x', `${event.clientX.toFixed(0)}px`);
      document.documentElement.style.setProperty('--laser-y', `${event.clientY.toFixed(0)}px`);
      setLaserEnabled((enabled) => {
        lastTracePointRef.current = enabled ? null : { x: event.clientX, y: event.clientY };
        lastTraceMidpointRef.current = null;
        return !enabled;
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    window.addEventListener('dblclick', onDoubleClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('dblclick', onDoubleClick);
    };
  }, [deck.enableLaser]);

  // Expose live navigation state so the CLI PDF exporter can drive and observe it.
  useEffect(() => {
    (window as unknown as { __DECK_META__?: unknown }).__DECK_META__ = {
      id: deck.id,
      slideCount: deck.slides.length,
      stepCounts: interactiveStepCounts,
      currentSlide,
      slideStep,
    };
  }, [deck, interactiveStepCounts, currentSlide, slideStep]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault();
        goNext();
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp' || event.key === 'Backspace') {
        event.preventDefault();
        goPrevious();
      }

      if (event.key === 'Home') {
        event.preventDefault();
        goToSlide(0);
      }

      if (event.key === 'End') {
        event.preventDefault();
        goToSlide(deck.slides.length - 1);
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onExit();
      }

      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        } else {
          void document.documentElement.requestFullscreen();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [deck, currentSlide, slideStep]);

  return (
    <main className={`deck-shell ${deck.themeClass}${isExporting ? ' is-exporting' : ''}`}>
      {Background && <Background />}
      {deck.enableLaser && !isExporting && (
        <>
          <svg className="laser-trace" ref={laserTraceRef} aria-hidden="true" />
          <div className={`laser-pointer${laserEnabled || laserPressed ? ' is-active' : ''}`} aria-hidden="true" />
        </>
      )}
      <section className="stage" aria-label={`${deck.title} slideshow`}>
        <Slide slideStep={interactiveStepCounts[currentSlide] ? slideStep : undefined} />
        {!isExporting && (
          <footer className="deck-footer">
            <ProgressBar current={currentSlide + 1} total={deck.slides.length} />
            <span className="speaker-note">{deck.speakerNotes?.[currentSlide] ?? ''}</span>
            <span className="keyboard-hint">{deck.footerHint ?? '← → / Space · Esc for decks'}</span>
          </footer>
        )}
      </section>
    </main>
  );
}
