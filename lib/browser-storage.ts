"use client";

import type { SignalBrief } from "@/lib/types";

const savedItemsKey = "choyis_saved_items";
const preferencesKey = "choyis_preferences";

export type SavedBrief = Pick<
  SignalBrief,
  "id" | "title" | "summary" | "sourceName" | "sourceUrl" | "originalUrl" | "publishedAt" | "category" | "country" | "region" | "imageUrl" | "tags" | "linkBehavior" | "providerType" | "contentType" | "isLive" | "isFallback" | "sourceLabel"
>;

export type ChoyisPreferences = {
  lastSearch?: string;
  preferredCountry?: string;
  preferredTab?: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getSavedItems() {
  return readJson<SavedBrief[]>(savedItemsKey, []);
}

export function isSavedItem(id: string) {
  return getSavedItems().some((item) => item.id === id);
}

export function toggleSavedItem(brief: SavedBrief) {
  const items = getSavedItems();
  const next = items.some((item) => item.id === brief.id)
    ? items.filter((item) => item.id !== brief.id)
    : [brief, ...items.filter((item) => item.id !== brief.id)].slice(0, 100);

  writeJson(savedItemsKey, next);
  window.dispatchEvent(new CustomEvent("choyis:saved-items"));
  return next.some((item) => item.id === brief.id);
}

export function getPreferences() {
  return readJson<ChoyisPreferences>(preferencesKey, {});
}

export function setPreference<K extends keyof ChoyisPreferences>(key: K, value: ChoyisPreferences[K]) {
  const current = getPreferences();
  const next = { ...current, [key]: value };
  writeJson(preferencesKey, next);
  return next;
}
