import { decks } from '../decks/registry';

type DeckPickerProps = {
  onPick: (id: string) => void;
};

export function DeckPicker({ onPick }: DeckPickerProps) {
  return (
    <main className="deck-picker">
      <div className="deck-picker-inner">
        <p className="deck-picker-eyebrow">Presentations</p>
        <h1 className="deck-picker-title">Choose a deck</h1>
        <ul className="deck-picker-list">
          {decks.map((deck, index) => (
            <li key={deck.id}>
              <button type="button" className="deck-picker-card" onClick={() => onPick(deck.id)}>
                <span className="deck-picker-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="deck-picker-body">
                  <span className="deck-picker-card-title">{deck.title}</span>
                  <span className="deck-picker-card-blurb">{deck.blurb}</span>
                </span>
                <span className="deck-picker-meta">{deck.slides.length} slides</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
