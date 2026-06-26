// Slides for the template deck. Each slide is a plain React component.
//
// A slide receives an optional `slideStep` (a 0-based step index) ONLY when its
// index is listed in `interactiveStepCounts` in deck.ts. Use it to reveal
// content progressively; otherwise ignore it.
import type { SlideProps } from '../types';

export function IntroSlide(_: SlideProps) {
  return (
    <section className="tpl-slide tpl-slide--hero">
      <p className="tpl-eyebrow">Section · Eyebrow</p>
      <h1 className="tpl-title">Your big opening line</h1>
      <p className="tpl-subtitle">A supporting sentence that sets up the talk.</p>
    </section>
  );
}

export function PointSlide(_: SlideProps) {
  return (
    <section className="tpl-slide">
      <h2 className="tpl-heading">A point worth making</h2>
      <ul className="tpl-list">
        <li>First supporting idea</li>
        <li>Second supporting idea</li>
        <li>Third supporting idea</li>
      </ul>
    </section>
  );
}

export function ClosingSlide(_: SlideProps) {
  return (
    <section className="tpl-slide tpl-slide--hero">
      <h1 className="tpl-title">The one thing to remember</h1>
      <p className="tpl-subtitle">Thanks — questions?</p>
    </section>
  );
}
