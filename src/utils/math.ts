import { gcd } from "mathjs";

export const findFactors = (numbers: number[]): number[] => {
  let factors: number[] = [];

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

  factors = factors.filter(n => isPrime(n))
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

export const calculateCorrelation = (coordinates: {x: number, y: number}[]) => {
  const n = coordinates.length;

  // Calculate the means of X and Y
  const sumX = coordinates.reduce((sum, point) => sum + point.x, 0);
  const sumY = coordinates.reduce((sum, point) => sum + point.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  // Calculate the deviations and products
  let sumProduct = 0;
  let sumSquaredDeviationX = 0;
  let sumSquaredDeviationY = 0;

  for (let i = 0; i < n; i++) {
    const deviationX = coordinates[i].x - meanX;
    const deviationY = coordinates[i].y - meanY;
    sumProduct += deviationX * deviationY;
    sumSquaredDeviationX += deviationX ** 2;
    sumSquaredDeviationY += deviationY ** 2;
  }

  // Calculate the correlation coefficient
  const correlation = sumProduct / Math.sqrt(sumSquaredDeviationX * sumSquaredDeviationY);

  return correlation;
}

export function lcm(numbers: number[]) {
  // Calculate LCM using the formula: LCM = (a * b) / GCD(a, b)
  function calculateLCM(a: number, b: number) {
    return (a * b) / gcd(a, b);
  }

  // Calculate LCM of array elements iteratively
  let lcm = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    lcm = calculateLCM(lcm, numbers[i]);
  }

  const factors = getFactors(lcm)

  let periodicity = 0
  for (let factor of factors) {
    if(factor === factors[0]) periodicity += factor
  }

  return periodicity;
}