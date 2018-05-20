import { Component, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { DeviceDetectorService } from '../shared/services/device-detector/device-detector.service';

declare const require: (moduleId: string) => any;
const OrbitControls = require('three-orbit-controls')(THREE);

declare const dat: any;
@Component({
    selector: 'background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.scss']
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

    constructor(private _deviceDetector: DeviceDetectorService) {
        this.animate = this.animate.bind(this);
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private createDeviceSettings() {
        this.mobileDevice = this._deviceDetector.mobile;
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
        //const gui = new dat.GUI();

        //let simulation = gui.addFolder('Simulation');
        //let rendering = gui.addFolder('Rendering');
        //let volumetricLighting = gui.addFolder('Volumetric Lighting');

        //simulation.add(this.simulationSettings, 'animate');
        //simulation.add(this.simulationSettings, 'persistence', 0, 1);
        //simulation.add(this.simulationSettings, 'speed', 0, 1);
        //simulation.add(this.simulationSettings, 'decay', 0, 1);

        //rendering.add(this.renderingSettings, 'mesh', { cube: 0, sphere: 1, disc: 2, cylinder: 3, rectangle: 4 }).listen().onChange(() => { this.setGeometry(this.renderingSettings.mesh) });
        //rendering.add(this.renderingSettings, 'scale', 0, 10);

        //rendering.add(this.renderingSettings, 'scaleX', 0, 1);
        //rendering.add(this.renderingSettings, 'scaleY', 0, 1);
        //rendering.add(this.renderingSettings, 'scaleZ', 0, 1);

        //volumetricLighting.add(this.volumetricLightingSettings, 'postProcessing');
        //volumetricLighting.add(this.volumetricLightingSettings, 'exposure', 0, 1);
        //volumetricLighting.add(this.volumetricLightingSettings, 'decay', 0, 1);
        //volumetricLighting.add(this.volumetricLightingSettings, 'density', 0, 1);
        //volumetricLighting.add(this.volumetricLightingSettings, 'weight', 0, 1);
        //volumetricLighting.add(this.volumetricLightingSettings, 'samples', 0, 100);

        //gui.close();
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

    private createGeometry() {

    }

    private createMesh() {

    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    /* Events */
    public onWindowResize(event: Event) {
        let canvasContainer: HTMLElement|null = document.getElementById('router-container');
        let positionInfo = canvasContainer!.getBoundingClientRect();

        let dPR = .5 * window.devicePixelRatio;
        //this.resolution.set(this.canvas.clientWidth * dPR, this.canvas.clientHeight * dPR);
        this.resolution.set(positionInfo.width * dPR, positionInfo.height * dPR);

        this.camera.aspect = positionInfo.width / positionInfo.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(positionInfo.width, positionInfo.height);
    }

    ngAfterViewInit() {
        this.createDeviceSettings();
        this.createScene();
        this.createCamera();
        this.createRendering();
        this.createGeometry();
        this.createMesh();
        this.animate();
        this.createControls();
        this.createGUI()
    }
}