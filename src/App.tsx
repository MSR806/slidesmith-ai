import { useEffect, useState } from 'react';
import { DeckPlayer } from './player/DeckPlayer';
import { DeckPicker } from './player/DeckPicker';
import { findDeck } from './decks/registry';

function deckIdFromHash(): string | undefined {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/');
  return parts[0] || undefined;
}

export default function App() {
  const [deckId, setDeckId] = useState<string | undefined>(deckIdFromHash);

  useEffect(() => {
    const onHashChange = () => setDeckId(deckIdFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const deck = findDeck(deckId);
    document.title = deck ? deck.title : 'Slidesmith AI';
  }, [deckId]);

  const deck = findDeck(deckId);

  if (!deck) {
    return (
      <DeckPicker
        onPick={(id) => {
          window.location.hash = `#/${id}/1`;
        }}
      />
    );
  }

  return (
    <DeckPlayer
      deck={deck}
      onExit={() => {
        window.location.hash = '#/';
      }}
    />
  );
}
