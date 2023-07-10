import { gcd } from "mathjs";
import { findFactors, getFactors, lcm} from "./math";

const primes = [2, 3, 5, 7, 11, 13, 17];

export interface Interval {
  num: number
  denom: number
}

export interface Space {
  equave: number
  dimensions: number[]
}

export interface Chord extends Array<Interval> {}

/* General chord utils */

const cents = (x: number): number => {
  return 1200 * Math.log2(x)
}

export const factorsToSpace = (ns: number[]): Space => {
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
  
  const chord: Chord = [{ num: 1, denom: 1 }];

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

export const chordToSuperChord = (chord: Chord, hyper: boolean) => {
  chord.sort((a, b) => (a.num/a.denom) - (b.num/b.denom))
  const superChord: Chord = hyper ? [...chord] : []
  
  for (let i=0; i<chord.length; i++) {
    for (let j=i+1; j<chord.length; j++) {

      const a: Interval = chord[i]
      const b: Interval = chord[j]

      let num = b.num * a.denom;
      let denom = b.denom * a.num;

      const GCD = gcd(num, denom);

      num /= GCD
      denom /= GCD

      superChord.push({ num, denom })
    }
  }

  return superChord;
}

/* Space utils */
export const intervalToCoord = (interval: Interval) => {
  const { num, denom } = interval;
  const numFactors = getFactors(num)
  const denomFactors = getFactors(denom)

  const coordinates = new Array(primes.length).fill(0);

  numFactors.forEach(factor => coordinates[primes.indexOf(factor)] ++ )
  denomFactors.forEach(factor => coordinates[primes.indexOf(factor)] -- )

  return coordinates;
}

export const coordToInterval = (coord: number[], space: Space): Interval => {
  let num = 1;
  let denom = 1;

  for(let i=0; i<coord.length; i++) {
    if (coord[i]>0){
      num *= Math.pow(primes[i], coord[i])
    } else if (coord[i]<0) {
      denom *= Math.pow(primes[i], -coord[i])
    }
  }

  while (num/denom < 1) num*= space.equave;
  while (num/denom > space.equave) denom*= space.equave;

  return { num, denom}
}

export const translateCoord = (coord: number[], space: Space): number[] => {
  for (let i=0; i<coord.length; i++) {
    // Duplicate all except equave
    if (primes[i] !== space.equave) coord[i] *= 2;
    // If it's the first dimension, -1
    if (primes[i] === space.dimensions[0]){
      coord[i] -= 1;
    }
  }
  return coord;
}

/* Translate the coord considering the center of symmetry */
export const translateChord = (chord: Chord, space: Space): Chord => {
  const newChord: Chord = [];
  for (let interval of chord){
    const coord: number[] = intervalToCoord(interval);
    const translatedCoord: number[] = translateCoord(coord, space);
    const translatedInterval: Interval = coordToInterval(translatedCoord, space);
    newChord.push(translatedInterval)
  }
  return newChord;
}

/* Tenney's Harmonic Distance */

export const chordHarmonicDistance = (chord: Chord, space: Space): number => {

  const intervalHarmonicDistance = (interval: Interval): number => {
    const { num, denom } = interval
    return Math.log(num * denom) / Math.log(space.equave);
  }

  let harmonicDistance = 0;
  for (let interval of chord){
    harmonicDistance += intervalHarmonicDistance(interval)
  }
  return harmonicDistance
}

/* Barlow's Harmonicity */

export const chordHarmonicity = (chord: Chord): number => {

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

  let totalHarmonicity = 0;
  for (let i=0; i<chord.length; i++) {
    const h = Math.abs(harmonicity(chord[i]))
    if(!isNaN(h)) totalHarmonicity += h;
  }
  return totalHarmonicity;
}

/* Sethares' Dissonance */

export const chordDissonance = (chord: Chord) => {

  const refFreq = 261.6256;

  const ampToLoudness = (amp: number): number => {
    const dB = 20 * Math.log(amp) / Math.log(10);
    const loudness = Math.pow(2, dB / 10) / 16;
    return loudness;
  }

  const harmonicToLoudness = (x: number): number => {
    const amp = 0.1+Math.pow(2, -(x-0.85));
    return ampToLoudness(amp);
  }

  const dissonance = (f1: number, f2: number, l1: number, l2: number): number => {
    const x = 0.24;
    const s1 = 0.0207;
    const s2 = 18.96;
    const fmin = Math.min(f1, f2);
    const fmax = Math.max(f1, f2);
    const s = x / (s1 * fmin + s2);
    const p = s * (fmax - fmin);
  
    const b1 = 3.51;
    const b2 = 5.75;
  
    const l12 = Math.min(l1, l2);
  
    return l12 * (Math.exp(-b1*p) - Math.exp(-b2*p));
  }

  const partialsArray = [1, 2, 3, 4, 5, 6, 7, 8];
  const allPartials: number[][] = new Array(partialsArray.length * chord.length);

  for (let i = 0; i < allPartials.length; i++) allPartials[i] = new Array(2);

  let count: number = 0;
  for (const partial of partialsArray) {
    for (const interval of chord) {
      allPartials[count][0] = (interval.num / interval.denom) * partial;
      allPartials[count][1] = harmonicToLoudness(partial);
      count++;
    }
  }

  let diss : number = 0;
  for (const partialA of allPartials) {
    for (const partialB of allPartials) {
      const f1 = refFreq * partialA[0];
      const f2 = refFreq * partialB[0];
      const l1 = partialA[1];
      const l2 = partialB[1];
      diss += dissonance(f1, f2, l1, l2);
    }
  }
  
  return diss;
}

/* Terhardt's virtual pitch */

export const virtualPitch = (factors: number[]) => {
  return factors[0]
}

/* Dial virtual pitch */

export const dualVirtualPitch = (factors: number[]) => {
  if (factors[0] < factors[factors.length-1]) return factors[0]
  return factors[factors.length-1]
}

/* Carmen Parker's Drone */

export const chordDroneValue = (factors: number[], space: Space) => {
  const primeFactors = getFactors(factors[0])
  for (let factor of primeFactors) if(factor !== space.equave) return 0
  return 1
}

/* Harmonic Entropy */

export const chordHarmonicEntropy = (chord: Chord): number => {

  const intervals: number[][] = [
    [1, 1],   [27, 26], [26, 25], [25, 24], [24, 23], [23, 22], [22, 21], [21, 20], [20, 19], 
    [19, 18], [18, 17], [17, 16], [16, 15], [15, 14], [14, 13], [27, 25], [13, 12], [25, 23], 
    [12, 11], [23, 21], [11, 10], [21, 19], [10, 9],  [19, 17], [9,8],    [26, 23], [17, 15], 
    [25, 22], [8, 7],   [23, 20], [15, 13], [22,19],  [7, 6],   [27, 23], [20, 17], [13, 11],
    [19, 16], [25, 21], [6, 5],   [23, 19], [17, 14], [11, 9],  [27, 22], [16, 13], [21, 17], 
    [26, 21], [5, 4],   [24, 19], [19, 15], [14, 11], [23, 18], [9, 7],   [22, 17], [13, 10], 
    [17, 13], [21, 16], [25, 19], [4, 3],   [27, 20], [23, 17], [19, 14], [15, 11], [26, 19],
    [11, 8],  [18, 13], [25, 18], [7, 5],   [24, 17], [17, 12], [27, 19], [10, 7],  [23, 16],
    [13, 9],  [16, 11], [19, 13], [22, 15], [25, 17], [3, 2],   [26, 17], [23, 15], [20, 13],
    [17, 11], [14, 9],  [25, 16], [11, 7],  [19,12],  [27, 17], [8, 5],   [21, 13], [13, 8],
    [18, 11], [23, 14], [5, 3],   [27, 16], [22, 13], [17, 10], [12, 7],  [19, 11], [26, 15],
    [7, 4],   [23, 13], [16, 9],  [25, 14], [9, 5],   [20, 11], [11, 6],  [24, 13], [13, 7],
    [15, 8],  [17, 9],  [19, 10], [21, 11], [23, 12], [25, 13], [27, 14], [2, 1],   [27, 13],
    [23, 11], [21, 10], [19, 9],  [17, 8],  [15, 7],  [13, 6],  [24, 11], [11, 5],  [20, 9],
    [9, 4],   [25, 11], [16, 7],  [23, 10], [7, 3],   [26, 11], [19, 8],  [12, 5],  [17, 7],
    [22, 9],  [27, 11], [5, 2],   [23, 9],  [18, 7],  [13, 5],  [21, 8],  [8, 3],   [27, 10],
    [19, 7],  [11, 4],  [25, 9],  [14, 5],  [17, 6],  [20, 7],  [23, 8],  [26, 9],  [3, 1]
  ];

  const S = (x: number): number => {
    const s = 17
    return Math.exp(- (x * x) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI))
  }

  const Q = (n: number, d: number, c: number): number => {
    const numerator = S(cents(n / d) - c);
    const denominator = Math.sqrt(n * d);
    return numerator / denominator;
  }

  const Qnorms = (c: number): number => {
    let sum = 0;
  
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const q = Q(interval[0], interval[1], c);
      sum += q;
    }
  
    return sum;
  }

  const P = (n: number, d: number, c: number): number => {
    return Q(n, d, c) / Qnorms(c);
  }

  function Plog(n: number, d:number, c: number) {
    const p = P(n, d, c);
    const result = p * Math.log(p);
    
    if (Number.isNaN(result) || !Number.isFinite(result)) {
      return 0;
    } else {
      return result;
    }
  }

  function HE(c: number) {
    let sum = 0;
  
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const plog = Plog(interval[0], interval[1], c);
      sum += plog;
    }
  
    return -1 * sum;
  }

  let he = 0;
  for (const interval of chord) {
    he += HE(cents(interval.num / interval.denom))
  }

  return he

}

/* Stolzenburg's Relative Periodicity */
/* https://arxiv.org/pdf/1306.6458.pdf */

export const chordRelativePeriodicity = (chord: Chord): number => {
  const LCM = lcm(chord.map(interval => interval.denom))
  return LCM
}

export const chordLogarithmicPeriodicity = (chord: Chord) => {

  const invertChord = (chord: Chord, inversion: number): Chord => {
    const invertedChord: Chord = []

    const simplifyInterval = (interval: Interval): Interval => {
      const GCD = gcd(interval.num, interval.denom)
      interval.num /= GCD
      interval.denom /= GCD
      return interval
    }

    const divideInterval = (a: Interval, b: Interval) => {
      let num = a.num * b.denom
      let denom = a.denom * b.num
      let interval = { num, denom }
      return simplifyInterval(interval)
    }

    for (let i=0; i<chord.length; i++){
      invertedChord.push(divideInterval(chord[i], chord[inversion]))
    }
    
    return invertedChord
  }

  let periodicity = Math.log2(chordRelativePeriodicity(chord))
  for (let i=1; i<chord.length; i++) {
    const invertedChord: Chord = invertChord(chord, i)
    periodicity += Math.log2(chordRelativePeriodicity(invertedChord))
  }
  return periodicity / chord.length
}

/* Pau */

export const symmetricHarmonicity = (chord: Chord, space: Space): number => {
  const translatedChord: Chord = translateChord(chord, space);
  const translatedSuperChord = chordToSuperChord(translatedChord, true)
  return chordHarmonicity(translatedSuperChord);
}

export const symmetricHarmonicDistance = (chord: Chord, space: Space): number => {
  const translatedChord: Chord = translateChord(chord, space);
  return chordHarmonicDistance(translatedChord, space);
}

export const symmetricHarmonicEntropy = (chord: Chord, space: Space): number => {
  const translatedChord: Chord = translateChord(chord, space);
  return chordHarmonicEntropy(translatedChord);
}

export const symmetricRelativePeriodicity = (chord: Chord, space: Space): number => {
  const translatedChord: Chord = translateChord(chord, space);
  return chordRelativePeriodicity(translatedChord);
}