import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { createDeck, deleteDeck, getDeck, listDecks, updateDeck } from './decks'
import {
  getAllCards,
  getCard,
  getReviewLogs,
  previewItem,
  recordReview,
  vocabCardId,
} from './srs'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

const NOW = new Date('2026-03-10T12:00:00')

describe('srs repository', () => {
  it('creates a card on the first review and logs it as new', async () => {
    const record = await recordReview({
      itemId: 'water',
      grade: 'good',
      mode: 'flashcards',
      now: NOW,
    })

    expect(record.id).toBe(vocabCardId('water'))
    expect(record.dueAt.getTime()).toBeGreaterThan(NOW.getTime())
    expect(await getCard('water')).toMatchObject({
      itemId: 'water',
      itemType: 'vocab',
    })

    const logs = await getReviewLogs(new Date(0))
    expect(logs).toHaveLength(1)
    expect(logs[0]).toMatchObject({
      itemId: 'water',
      grade: 'good',
      mode: 'flashcards',
      wasNew: true,
    })
  })

  it('updates the same card on later reviews', async () => {
    const first = await recordReview({
      itemId: 'water',
      grade: 'good',
      mode: 'choice',
      now: NOW,
    })
    const second = await recordReview({
      itemId: 'water',
      grade: 'good',
      mode: 'choice',
      now: first.dueAt,
    })

    expect(await getAllCards()).toHaveLength(1)
    expect(second.card.reps).toBe(2)
    expect(second.dueAt.getTime()).toBeGreaterThan(first.dueAt.getTime())
    const logs = await getReviewLogs(new Date(0))
    expect(logs.map((l) => l.wasNew)).toEqual([true, false])
  })

  it('previews intervals even for never-studied items', async () => {
    const preview = await previewItem('water', NOW)
    expect(preview.good.getTime()).toBeGreaterThan(preview.again.getTime())
  })

  it('filters logs by date', async () => {
    await recordReview({
      itemId: 'a',
      grade: 'good',
      mode: 'typing',
      now: new Date('2026-01-01'),
    })
    await recordReview({ itemId: 'b', grade: 'good', mode: 'typing', now: NOW })
    expect(
      (await getReviewLogs(new Date('2026-03-01'))).map((l) => l.itemId),
    ).toEqual(['b'])
  })
})

describe('decks repository', () => {
  it('creates, updates and soft-deletes decks', async () => {
    const deck = await createDeck({
      name: '  Viagem ',
      itemIds: ['bus', 'taxi', 'bus'],
    })
    expect(deck).toMatchObject({
      name: 'Viagem',
      itemIds: ['bus', 'taxi'],
      deletedAt: null,
    })

    await updateDeck(deck.id, { name: 'Trip', itemIds: ['airport'] })
    expect(await getDeck(deck.id)).toMatchObject({
      name: 'Trip',
      itemIds: ['airport'],
    })

    await deleteDeck(deck.id)
    expect(await getDeck(deck.id)).toBeUndefined()
    expect(await listDecks()).toEqual([])
    expect(await db.decks.count()).toBe(1) // tombstone kept for sync
  })
})
