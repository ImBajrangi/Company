import * as THREE from 'three'
import Model from './Abstracts/Model.js'
import Experience from '../Experience.js'
import Debug from '../Utils/Debug.js'
import State from "../State.js";
import Materials from "../Materials/Materials.js";

import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { LoopSubdivision } from 'three-subdivide';


export default class Logo extends Model {
    experience = Experience.getInstance()
    debug = Debug.getInstance()
    state = State.getInstance()
    materials = Materials.getInstance()
    scene = experience.scene
    time = experience.time
    camera = experience.camera.instance
    renderer = experience.renderer.instance
    resources = experience.resources
    container = new THREE.Group();

    constructor() {
        super()
        
        // Wait for resources to load
        if (this.resources.items.logoTexture && this.resources.items.particleTexture) {
            this.setModel()
        } else {
            console.warn('Required textures not loaded')
        }
    }

    setModel() {
        const logoTexture = this.resources.items.logoTexture
        //const logoTexture = this.resources.items.japanTexture
        //const logoTexture = this.resources.items.journeyTexture
        const img = logoTexture.image;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);


        const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
        const positions = [];
        const colors = [];

        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                const i = (y * img.width + x) * 4;
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];

                const brightness = (r + g + b) / 3;

                if (brightness > 200) { // not transparent pixels
                    positions.push((x - img.width / 2) / 100, -(y - img.height / 2) / 100, 0);
                    //colors.push(r / 255, g / 255, b / 255, a);
                }
            }
        }

        const logoGeometry = this.logoGeometry = new THREE.BufferGeometry();
        logoGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        logoGeometry.setIndex(null);

        this.positions = positions;

        // Create material for particles
        const material = new THREE.PointsMaterial({
            size: 0.015,
            sizeAttenuation: true,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            map: this.resources.items.particleTexture
        });

        // Create points
        this.points = new THREE.Points(logoGeometry, material);
        this.container.add(this.points);
        this.scene.add(this.container);
    }

    resize() {

    }

    setDebug() {
        if ( !this.debug.active ) return

        //this.debug.createDebugTexture( this.resources.items.displacementTexture )
    }

    update(deltaTime) {
        if (this.points) {
            // Add some gentle rotation
            this.container.rotation.y += deltaTime * 0.2;
            
            // Add wave animation to particles
            const positions = this.points.geometry.attributes.position.array;
            const time = this.time.elapsed;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                
                // Add a sine wave effect
                positions[i + 2] = Math.sin(x * 2 + time) * 0.1 + Math.cos(y * 2 + time) * 0.1;
            }
            
            this.points.geometry.attributes.position.needsUpdate = true;
        }
    }

}
