import invariant from 'tiny-invariant'

export interface Color {
  r: number
  g: number
  b: number
  a: number
}

export function rgb(r: number, g: number, b: number): Color
export function rgb(r: number): Color
export function rgb(
  r: number,
  g?: number,
  b?: number,
): Color {
  return rgba(r, g ?? r, b ?? r, 1)
}

export function rgba(
  r: number,
  g: number,
  b: number,
  a: number,
): Color
export function rgba(rgb: number, a: number): Color
export function rgba(
  r: number,
  g: number,
  b?: number,
  a?: number,
): Color {
  if (b === undefined) {
    invariant(a === undefined)
    return {
      r: r / 255,
      g: r / 255,
      b: r / 255,
      a: g,
    }
  }
  invariant(a !== undefined)
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a,
  }
}
