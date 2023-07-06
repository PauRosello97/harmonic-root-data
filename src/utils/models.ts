import { gcd } from "mathjs";
import { findFactors } from "./math";

const primes = [2, 3, 5, 7, 11, 13, 17];

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
  
  const [equave, ...dimensions] = factors;

  const space: Space = { equave, dimensions }

  return space
}

export const factorsToChord = (factors: number[], equave: number): Chord => {
  
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

export const factorsToSuperChord = (factors: number[], equave: number): Chord => {
  
  const chord: Chord = [];

  for (let j=0; j<factors.length-1; j++) {
    for (let i=j+1; i<factors.length; i++) {
      const n = factors[i]
      const GCD = gcd(n, factors[j]);

      let num = n / GCD
      let denom = factors[j] / GCD
  
      if (factors[factors.length - 1] > factors[j]) { // If otonal
        if (denom > num) num *= equave;
      } else { // If utonal
        const n = num;
        num = denom;
        denom = n;
      }
      chord.push({ num, denom })
    }
  }
  return chord;
}

/* Tenney's Harmonic Distance */

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

/* Barlow's Harmonicity */

// TODO: Les funcions Javascript són correctes. Cal calcular TOTS els intervals. 

export const chordHarmonicity = (chord: Chord): number => {
  let totalHarmonicity = 0;
  for (let i=0; i<chord.length; i++) {
    totalHarmonicity += Math.abs(harmonicity(chord[i]));
  }
  return totalHarmonicity;
}

const harmonicity = (interval: Interval) => {
  const q = indigestibility(interval.num);
  const p = indigestibility(interval.denom);
  const harmonicity = signum(p - q)/(p+q);

  return harmonicity;
}

const signum = (n: number): number => {
  if (n>0) return -1;
  if (n<0) return 1;
  return 0;
}

const indigestibility = (n: number) => {
  const factors: number[] = new Array(primes.length).fill(0);

  for (let i=0; i<primes.length; i++) {
    const prime = primes[i];
    if (n%prime === 0) {
      n/=prime;
      factors[i]++;
      i--;
    }
  }

  let indigestibility = 0;
  for (let i=0; i<primes.length; i++) {
    const nr = factors[i];
    const pr = primes[i];
    indigestibility += nr * Math.pow(pr-1, 2)/pr;
  }  
  indigestibility *= 2;

  return indigestibility;
}




