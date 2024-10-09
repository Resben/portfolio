import * as THREE from "three";


export const toDegrees = (radians) => radians * (180 / Math.PI);

export const toRadians = (degrees) => degrees * (Math.PI / 180);

export const toDegreesArray = (array) => [toDegrees(array[0]), toDegrees(array[1]), toDegrees(array[2])];

export const toRadiansArray = (array) => [toRadians(array[0]), toRadians(array[1]), toRadians(array[2])];

