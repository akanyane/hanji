import { db, newSyncFields } from './db'
import type { DeckRecord } from './types'

// Repository for decks the learner creates.

export interface DeckInput {
  name: string
  itemIds: string[]
}

export async function listDecks(): Promise<DeckRecord[]> {
  const decks = await db.decks.toArray()
  return decks
    .filter((d) => d.deletedAt === null)
    .sort((a, b) => a.createdAt - b.createdAt)
}

export async function getDeck(id: string): Promise<DeckRecord | undefined> {
  const deck = await db.decks.get(id)
  return deck && deck.deletedAt === null ? deck : undefined
}

export async function createDeck({
  name,
  itemIds,
}: DeckInput): Promise<DeckRecord> {
  const now = Date.now()
  const deck: DeckRecord = {
    ...newSyncFields(now),
    name: name.trim(),
    itemIds: [...new Set(itemIds)],
    createdAt: now,
  }
  await db.decks.add(deck)
  return deck
}

export async function updateDeck(
  id: string,
  { name, itemIds }: DeckInput,
): Promise<void> {
  await db.decks.update(id, {
    name: name.trim(),
    itemIds: [...new Set(itemIds)],
    updatedAt: Date.now(),
  })
}

/** Soft delete, so the deletion can be synced later. */
export async function deleteDeck(id: string): Promise<void> {
  const now = Date.now()
  await db.decks.update(id, { deletedAt: now, updatedAt: now })
}
