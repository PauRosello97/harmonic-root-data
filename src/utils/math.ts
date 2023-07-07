import {
    multiply, transpose, inv
} from 'mathjs'

export function trend(xs: number[], ys: number[]) {
    let X: number[][] = xs.map(x => {
        return [1, x];
    });

    // Transposed
    let Xt: number[][] = X.map(function (arr) {
        return arr.slice();
    });
    Xt = transpose(Xt);
    let M = inv(multiply(X, Xt));
    M = multiply(Xt, M);
    M = multiply(M, ys);
}

export const findFactors = (numbers: number[]): number[] => {
  const factors: number[] = [];

  for (const number of numbers) {
    if (isPrime(number)) {
      factors.push(number);
    } else {
      for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
          factors.push(i);
          if (number / i !== i) {
            factors.push(number / i);
          }
        }
      }
    }
  }

  return Array.from(new Set(factors)).sort((a, b) => a - b);
};

const isPrime = (number: number): boolean => {
  if (number < 2) return false;

  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
};

export const getFactors = (number: number) => {
  var primeFactors = [];
  var divisor = 2;
  
  while (number >= 2) {
    if (number % divisor === 0) {
      primeFactors.push(divisor); // Add the divisor as a prime factor
      number = number / divisor;
    } else {
      divisor++;
    }
  }
  
  return primeFactors;
}