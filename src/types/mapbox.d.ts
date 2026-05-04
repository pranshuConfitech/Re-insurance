// Type declaration for @mapbox/point-geometry
declare module '@mapbox/point-geometry' {
    export default class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
        clone(): Point;
        add(p: Point): Point;
        sub(p: Point): Point;
        mult(k: number): Point;
        div(k: number): Point;
        rotate(a: number): Point;
        matMult(m: number[]): Point;
        unit(): Point;
        perp(): Point;
        round(): Point;
        mag(): number;
        equals(p: Point): boolean;
        dist(p: Point): number;
        distSqr(p: Point): number;
        angle(): number;
        angleTo(p: Point): number;
        angleWidth(p: Point): number;
        angleWithSep(x: number, y: number): number;
    }
}

// Also declare for the alternative module name format
declare module 'mapbox__point-geometry' {
    export * from '@mapbox/point-geometry';
}

