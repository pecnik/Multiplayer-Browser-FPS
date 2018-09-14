import * as THREE from "three";
import { DEFAULT_BOX, DEFAULT_MATERIAL } from "./assets";

export class DecayComponent {
    constructor(ttl = 0) {
        this.ttl = ttl;
    }
}

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

export class HealthComponent {
    constructor() {
        this.hp = this.max = 100;
    }
}

export class DamageComponent {
    constructor() {
        this.creatorId = "";
        this.dmg = 5;
    }
}

export class Object3DComponent extends THREE.Object3D {
    /**
     * @param {THREE.Mesh} mesh
     */
    constructor(mesh) {
        super();
        this.mesh = mesh;
        this.add(this.mesh);
    }

    getAABB() {
        return {
            min: {
                x: this.position.x - this.scale.x * 0.5,
                y: this.position.y - this.scale.y * 0.5,
                z: this.position.z - this.scale.z * 0.5
            },
            max: {
                x: this.position.x + this.scale.x * 0.5,
                y: this.position.y + this.scale.y * 0.5,
                z: this.position.z + this.scale.z * 0.5
            }
        };
    }
}

export class HeadComponent extends THREE.Object3D {
    /**
     * @param {THREE.Mesh} mesh
     */
    constructor(mesh) {
        super();
        this.position.y = 2;
        this.position.z = 0;
        this.mesh = mesh;
        this.add(mesh);
    }

    getFacingDirection() {
        const direction = new THREE.Vector3(0, 0, -1);
        const matrix = new THREE.Matrix4();
        matrix.extractRotation(this.matrixWorld);
        return matrix.multiplyVector3(direction);
    }
}
