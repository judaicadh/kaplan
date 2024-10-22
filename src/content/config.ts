/*
// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';
import { file } from "astro/loaders";
import { parse as parseToml } from "toml";
import { parse as parseCsv } from "csv-parse/sync";
// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Define your collection(s)
const items = defineCollection({ /!* ... *!/ });
const contributors = defineCollection({ /!* ... *!/ });

// 4. Export a single `collections` object to register your collection(s)
export const collections = { items, contributors };*/
