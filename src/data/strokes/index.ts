import type { StrokeData } from '../types';
import strokes from './strokes.json';
import extra from './extra.json';

/**
 * Ordem dos traços (KanjiVG). Chave = o caractere; "p" são os caminhos SVG
 * na ordem em que se desenha, "n" a posição do número de cada traço.
 * Veja LICENSE.md ao lado (CC BY-SA 3.0).
 */
export const STROKES = { ...strokes, ...extra } as unknown as Readonly<Record<string, StrokeData>>;
