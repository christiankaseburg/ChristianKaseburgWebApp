import { Component, AfterViewInit, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';
import { PingPongTexture } from '../experiments/projects/helpers/PingPongTexture';
import { DeviceDetectorService } from '../../services/shared/device-detector/device-detector.service';
import { Godrays } from '../experiments/projects/postprocessing/godrays';

declare const require: (moduleId: string) => any;
const OrbitControls = require('three-orbit-controls')(THREE);
const EffectComposer = require('three-effectcomposer')(THREE);
declare const dat: any;

@Component({
    selector: 'background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.scss'],
})

export class BackgroundComponent { // Project 1

    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private cameraTarget: THREE.Vector3;
    private resolution = new THREE.Vector2();
    private controls: THREE.OrbitControls;

    @ViewChild('canvas')
    private canvasRef: ElementRef;

    private fieldOfView: number = 70;
    private nearClippingPane: number = .1;
    private farClippingPane: number = 1000;

    private mobileDevice: boolean;
    private isBrowser;
    private size: number;
    private floatType: any;

    private mesh: THREE.Mesh;
    private geometry: THREE.InstancedBufferGeometry = new THREE.InstancedBufferGeometry();
    private bufferGeometry: THREE.BoxBufferGeometry;
    private material: THREE.RawShaderMaterial;
    private simulationShader: THREE.RawShaderMaterial;
    private simulation: PingPongTexture;
    private posTexture: THREE.DataTexture;
    private buffers: number = 2;

    private godrays: Godrays;

    private materialVertexShader = require('../experiments/projects/glsl/project1/mesh.vert');
    private materialFragmentShader = require('../experiments/projects/glsl/project1/mesh.frag');
    private occlusionFragmentShader = require('../experiments/projects/glsl/project1/occlusion.frag');
    private occlusionVertexShader = require('../experiments/projects/glsl/project1/occlusion.vert');
    private simVertexShader = require('../experiments/projects/glsl/project1/simulation.vert');
    private simFragmentShader = require('../experiments/projects/glsl/project1/simulation.frag');

    private volumetricLightingSettings = {
        postProcessing: true,
        exposure: 0.3,
        decay: 0.95,
        density: 0.9,
        weight: 0.4,
        samples: 100
    };

    private simulationSettings = {
        animate: true,
        persistence: 1.0,
        speed: .05,
        decay: .1,
    };

    private renderingSettings = {
        mesh: 4,
        scale: 1,
        scaleX: 1.0,
        scaleY: 1.0,
        scaleZ: 1.0,
    };

    constructor(private _deviceDetector: DeviceDetectorService) {
        this.animate = this.animate.bind(this);
    }

    private get canvas(): HTMLCanvasElement {

        return this.canvasRef.nativeElement;
    }

    private createDeviceSettings() {

        this.mobileDevice = this._deviceDetector.mobile;

        this.size = this.mobileDevice ? 64 : 128;
        this.floatType = this.mobileDevice ? THREE.HalfFloatType : THREE.FloatType;
    }

    private createScene() {

        this.scene = new THREE.Scene();
    }

    private createCamera() {

        let aspectRatio = this.getAspectRatio();
        let dPR = .5 * window.devicePixelRatio;

        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );

        this.camera.position.set(0, 125, 250);

        this.resolution.set(this.canvas.clientWidth * dPR, this.canvas.clientHeight * dPR);
    }

    private createControls() {

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
    }

    private getAspectRatio(): number {

        let height = this.canvas.clientHeight;

        if (height === 0) {
            return 0;
        }

        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private createGUI() {
        const gui = new dat.GUI();

        let simulation = gui.addFolder('Simulation');
        let rendering = gui.addFolder('Rendering');
        let volumetricLighting = gui.addFolder('Volumetric Lighting');

        simulation.add(this.simulationSettings, 'animate');
        simulation.add(this.simulationSettings, 'persistence', 0, 1);
        simulation.add(this.simulationSettings, 'speed', 0, 1);
        simulation.add(this.simulationSettings, 'decay', 0, 1);

        rendering.add(this.renderingSettings, 'mesh', { cube: 0, sphere: 1, disc: 2, cylinder: 3, rectangle: 4 }).listen().onChange(() => { this.setGeometry(this.renderingSettings.mesh) });
        rendering.add(this.renderingSettings, 'scale', 0, 10);

        rendering.add(this.renderingSettings, 'scaleX', 0, 1);
        rendering.add(this.renderingSettings, 'scaleY', 0, 1);
        rendering.add(this.renderingSettings, 'scaleZ', 0, 1);

        volumetricLighting.add(this.volumetricLightingSettings, 'postProcessing');
        volumetricLighting.add(this.volumetricLightingSettings, 'exposure', 0, 1);
        volumetricLighting.add(this.volumetricLightingSettings, 'decay', 0, 1);
        volumetricLighting.add(this.volumetricLightingSettings, 'density', 0, 1);
        volumetricLighting.add(this.volumetricLightingSettings, 'weight', 0, 1);
        volumetricLighting.add(this.volumetricLightingSettings, 'samples', 0, 100);

        gui.close();
    }

    private createRendering() {

        try {
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true
            });
        } catch (e) {
            alert('You need to use the browser chrome, firefox, or enable webgl to see these 3D graphics.');
        }

        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0xFFFFFF, 1);
        this.renderer.autoClear = true;
    }

    private createDataTexture() {
        let positions = new Float32Array(this.size * this.size * 4);

        for (let i = 0, l = this.size * this.size; i < l; i++) {

            let phi = Math.random() * 2 * Math.PI;
            let costheta = Math.random() * 2 - 1;
            let theta = Math.acos(costheta);
            let r = 75 - (Math.random() * 1); // 100 instead of 75 before

            positions[i * 4] = r * Math.sin(theta) * Math.cos(phi);
            positions[i * 4 + 1] = r * Math.sin(theta) * Math.sin(phi);
            positions[i * 4 + 2] = r * Math.cos(theta);
            positions[i * 4 + 3] = Math.random() * 100;

        }

        this.posTexture = new THREE.DataTexture(positions, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
        this.posTexture.needsUpdate = true;
    }

    private createGeometry() {

        this.bufferGeometry = new THREE.BoxBufferGeometry(6., 2., .5);
        this.geometry.index = this.bufferGeometry.index;
        (this.geometry as any).attributes.position = (this.bufferGeometry as any).attributes.position;
        (this.geometry as any).attributes.uv = (this.bufferGeometry as any).attributes.uv;
        (this.geometry as any).attributes.normal = (this.bufferGeometry as any).attributes.normal;

        let lookup: number[] = [];

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                lookup.push(j / this.size);
                lookup.push(i / this.size);
            }
        }

        this.geometry.addAttribute('lookup', new THREE.InstancedBufferAttribute(new Float32Array(lookup), 2));
    }

    private createMesh() {

        this.material = new THREE.RawShaderMaterial({
            uniforms: {
                curPos: { type: 't', value: this.posTexture },
                prevPos: { type: 't', value: this.posTexture },
                lightPos: { type: 'v3', value: new THREE.Vector3(0.5, 0.5, 0) },
                scale: { type: 'v3', value: new THREE.Vector3(1, 1, 1) },
                color: { type: 'v3', value: new THREE.Color(0x000000)}
            },
            vertexShader: this.materialVertexShader,
            fragmentShader: this.materialFragmentShader,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    private initPingPongTexture() {

        this.simulationShader = new THREE.RawShaderMaterial({
            uniforms: {
                source: { type: 't', value: this.posTexture },
                seed: { type: 't', value: this.posTexture },
                time: { type: 'f', value: 0 },
                persistence: { type: 'f', value: 1. },
                speed: { type: 'f', value: .05 },
                spread: { type: 'f', value: .2 },
                decay: { type: 'f', value: .5 },
                init: { type: 'f', value: .1 }
            },
            vertexShader: this.simVertexShader,
            fragmentShader: this.simFragmentShader
        });
        this.simulation = new PingPongTexture(this.renderer, this.simulationShader, this.size, this.size, THREE.RGBAFormat, this.floatType, this.buffers);
    }

    private initGodRays() {

        let lightMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(50, 16, 16), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: 2 }));

        let occlusionMesh = new THREE.Mesh(this.geometry, new THREE.RawShaderMaterial({
            uniforms: {
                scale: { type: 'v3', value: new THREE.Vector3(1, 1, 1) },
                curPos: { type: 't', value: this.posTexture },
                prevPos: { type: 't', value: this.posTexture },
                lightPos: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
                color: { type: 'v3', value: new THREE.Color(0x000000) }
            },
            vertexShader: this.occlusionVertexShader,
            fragmentShader: this.occlusionFragmentShader,
            side: THREE.DoubleSide
        }));

        this.godrays = new Godrays(this.scene, this.camera, this.renderer, lightMesh, occlusionMesh);
    }

    private setGeometry(id) {

        let s = 1.;
        let bufferGeometry;
        if (id == 0) bufferGeometry = new THREE.BoxBufferGeometry(s, s, s);
        if (id == 1) bufferGeometry = new THREE.IcosahedronBufferGeometry(s, 1);
        if (id == 2) bufferGeometry = new THREE.CylinderBufferGeometry(s, s, s, 10, 1);
        if (id == 3) {
            bufferGeometry = new THREE.CylinderBufferGeometry(s, s, s, 10, 1);
            let rot = new THREE.Matrix4().makeRotationX(Math.PI / 2);
            bufferGeometry.applyMatrix(rot);
        }
        if (id == 4) bufferGeometry = new THREE.BoxBufferGeometry(6., 2., .5);

        (this.mesh as any).geometry.index = bufferGeometry.index;
        (this.mesh as any).geometry.attributes.position = bufferGeometry.attributes.position;
        (this.mesh as any).geometry.attributes.uv = bufferGeometry.attributes.uv;
        (this.mesh as any).geometry.attributes.normal = bufferGeometry.attributes.normal;
        this.godrays.occlusionMesh.geometry = this.mesh.geometry;
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (this.simulationSettings.animate) {
            this.simulation.shader.uniforms.persistence.value = this.simulationSettings.persistence;
            this.simulation.shader.uniforms.speed.value = this.simulationSettings.speed;
            this.simulation.shader.uniforms.decay.value = this.simulationSettings.decay;
            this.simulation.shader.uniforms.time.value = performance.now();
            this.simulation.render();

            (this.mesh as any).material.uniforms.curPos.value = this.simulation.front.texture;
            (this.mesh as any).material.uniforms.prevPos.value = this.simulation.back.texture;
            (this.godrays as any).occlusionMesh.material.uniforms.curPos.value = (this.mesh as any).material.uniforms.curPos.value;
            (this.godrays as any).occlusionMesh.material.uniforms.prevPos.value = (this.mesh as any).material.uniforms.prevPos.value;
            this.simulation.shader.uniforms.init.value = 0;
        }

        (this.mesh as any).material.uniforms.scale.value.set(this.renderingSettings.scaleX, this.renderingSettings.scaleY, this.renderingSettings.scaleZ).multiplyScalar(this.renderingSettings.scale);
        (this.godrays as any).occlusionMesh.material.uniforms.scale.value.set(this.renderingSettings.scaleX, this.renderingSettings.scaleY, this.renderingSettings.scaleZ).multiplyScalar(this.renderingSettings.scale);

        if (this.volumetricLightingSettings.postProcessing) {
            this.godrays.uniforms.decay.value = this.volumetricLightingSettings.decay;
            this.godrays.uniforms.density.value = this.volumetricLightingSettings.density;
            this.godrays.uniforms.exposure.value = this.volumetricLightingSettings.exposure;
            this.godrays.uniforms.weight.value = this.volumetricLightingSettings.weight;
            this.godrays.uniforms.samples.value = this.volumetricLightingSettings.samples;

            // Show occlusion scene, make background black for render, and apply volumetric shader.
            this.renderer.autoClear = false;
            this.camera.layers.set(this.godrays.OCCLUSION_LAYER);
            this.renderer.setClearColor(0x000000);
            this.godrays.occlusionComposer.render();

            // show the objects in the lit scene, and blend the volumetric light effect
            this.camera.layers.set(this.godrays.DEFAULT_LAYER);
            this.godrays.composer.render();

        } else {

            this.renderer.autoClear = true;
            this.renderer.render(this.scene, this.camera);
        }
    }

    /* Events */
    private onWindowResize(event: Event) {

        let dPR = .5 * window.devicePixelRatio;
        this.resolution.set(this.canvas.clientWidth * dPR, this.canvas.clientHeight * dPR);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    ngAfterViewInit() {
        this.createDeviceSettings();
        this.createScene();
        this.createCamera();
        this.createRendering();
        this.createDataTexture();
        this.createGeometry();
        this.createMesh();
        this.initPingPongTexture();
        this.initGodRays();
        this.animate();
        this.createControls();
        this.createGUI()
    }
}