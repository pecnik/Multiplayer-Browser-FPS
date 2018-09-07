import * as THREE from "three";

export const [DEFAULT_BOX, DEFAULT_MATERIAL] = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial()
];

export class ControllerComponent {
    constructor() {
        this.speed = 0.01;
        this.input = {
            forward: false,
            left: false,
            back: false,
            right: false,
            jump: false
        };
    }
}

export class VelocityComponent {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}

export class JetpackComponent {
    constructor() {
        this.maxFuel = 2000;
        this.minFuel = -1000;
        this.fuel = this.maxFuel;
    }
}

export class MeshComponent {
    constructor() {
        this.body = new THREE.Mesh(DEFAULT_BOX, DEFAULT_MATERIAL);
        this.head = new THREE.Mesh(DEFAULT_BOX, DEFAULT_MATERIAL);
        this.head.position.y = 1.2;
        this.head.position.z = -0.25;
        this.body.add(this.head);
    }

    getFacingDirection() {
        const direction = new THREE.Vector3(0, 0, -1);
        const matrix = new THREE.Matrix4();
        matrix.extractRotation(this.head.matrixWorld);
        return matrix.multiplyVector3(direction);
    }
}
