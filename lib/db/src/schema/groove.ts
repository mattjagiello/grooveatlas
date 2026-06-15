import { integer, numeric, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const erasTable = pgTable("eras", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  years: text("years").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  characteristics: text("characteristics").array().notNull(),
  keyDrummerIds: text("key_drummer_ids").array().notNull(),
  iconicSongIds: text("iconic_song_ids").array().notNull(),
});

export const insertEraSchema = createInsertSchema(erasTable);
export type InsertEra = typeof erasTable.$inferInsert;
export type Era = typeof erasTable.$inferSelect;

export const genresTable = pgTable("genres", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  origin: text("origin").notNull(),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  era: text("era").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  characteristics: text("characteristics").array().notNull(),
  keyDrummerIds: text("key_drummer_ids").array().notNull(),
  iconicSongIds: text("iconic_song_ids").array().notNull(),
});

export const insertGenreSchema = createInsertSchema(genresTable);
export type InsertGenre = typeof genresTable.$inferInsert;
export type Genre = typeof genresTable.$inferSelect;

export const drummersTable = pgTable("drummers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  born: integer("born").notNull(),
  died: integer("died"),
  primaryEra: text("primary_era").notNull(),
  eras: text("eras").array().notNull(),
  genres: text("genres").array().notNull(),
  bands: text("bands").array().notNull(),
  bio: text("bio").notNull(),
  signatureStyle: text("signature_style").notNull(),
  bpmMin: integer("bpm_min").notNull(),
  bpmMax: integer("bpm_max").notNull(),
  influence: text("influence").notNull(),
  iconicSongIds: text("iconic_song_ids").array().notNull(),
});

export const insertDrummerSchema = createInsertSchema(drummersTable);
export type InsertDrummer = typeof drummersTable.$inferInsert;
export type Drummer = typeof drummersTable.$inferSelect;

export const songsTable = pgTable("songs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  drummerId: text("drummer_id").notNull(),
  year: integer("year").notNull(),
  eraId: text("era_id").notNull(),
  genreIds: text("genre_ids").array().notNull(),
  tempo: integer("tempo").notNull(),
  feel: text("feel").notNull(),
  complexity: integer("complexity").notNull(),
  description: text("description").notNull(),
  whyStudy: text("why_study").notNull(),
  songsterrSlug: text("songsterr_slug"),
  lyricsSnippet: text("lyrics_snippet"),
});

export const insertSongSchema = createInsertSchema(songsTable);
export type InsertSong = typeof songsTable.$inferInsert;
export type Song = typeof songsTable.$inferSelect;
