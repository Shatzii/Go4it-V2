/**
 * Unit conversion utility for handling both imperial and metric measurements
 */

// Weight conversions
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

// Height/Length conversions
export function cmToInches(cm: number): number {
  return cm / 2.54;
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cmToInches(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm(feet * 12 + inches);
}

// Formatted string conversions
export function formatHeight(heightCm: number, useImperial: boolean = false): string {
  if (useImperial) {
    const { feet, inches } = cmToFeetInches(heightCm);
    return `${feet}'${inches}"`;
  }
  return `${heightCm} cm`;
}

export function formatWeight(weightKg: number, useImperial: boolean = false): string {
  if (useImperial) {
    const lbs = Math.round(kgToLbs(weightKg));
    return `${lbs} lbs`;
  }
  return `${weightKg} kg`;
}

// Temperature conversions (for recovery tracking)
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

// Distance conversions (for running/training)
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

export function milesToKm(miles: number): number {
  return miles / 0.621371;
}

// Pace conversions
export function minPerKmToMinPerMile(minPerKm: number): number {
  return minPerKm / 0.621371; 
}

export function minPerMileToMinPerKm(minPerMile: number): number {
  return minPerMile * 0.621371;
}

// Format time (for workouts, etc.)
export function formatTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Object for tracking user preference
export type MeasurementSystem = 'metric' | 'imperial';

// Default to metric for international use, with ability to switch to imperial
export const DEFAULT_MEASUREMENT_SYSTEM: MeasurementSystem = 'metric';