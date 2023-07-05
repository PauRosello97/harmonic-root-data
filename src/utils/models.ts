import { gcd } from "mathjs";
import { findFactors } from "./math";

interface Interval {
  num: number
  denom: number
}

export interface Space {
  equave: number
  dimensions: number[]
}

export interface Chord extends Array<Interval> {}

/* General chord utils */

export const getSpace = (ns: number[]): Space => {
  const factors = findFactors(ns)
  console.log(factors)
  const [equave, ...dimensions] = factors;

  const space: Space = { equave, dimensions }

  return space
}

export const nameToChord = (factors: number[], equave: number): Chord => {
  
  const chord: Chord = [];

  for (let n of factors) {
    const GCD = gcd(n, factors[0]);

    let num = n / GCD
    let denom = factors[0] / GCD

    if (factors[factors.length - 1] > factors[0]) { // If otonal
      if (denom > num) num *= equave;
    } else { // If utonal
      const n = num;
      num = denom;
      denom = n;
    }
    
    chord.push({ num, denom })
  }
  return chord;
}

/* Harmonic distance */

export const intervalHarmonicDistance = (interval: Interval): number => {
  const { num, denom } = interval
  return Math.log(num * denom) / Math.log(2);
}

export const chordHarmonicDistance = (chord: Chord): number => {
  let harmonicDistance = 0;
  for (let interval of chord){
    harmonicDistance += intervalHarmonicDistance(interval)
  }
  return harmonicDistance
}



