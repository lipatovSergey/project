import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;

export function init3D() {
    const container = document.getElementById('3d-container');

    // Clean up existing scene if it exists
    dispose3D();

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Светлый фон

    // Camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3; // Увеличиваем расстояние камеры

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    // Define different colors for each face of the cube
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // red
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // green
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // blue
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // yellow
        new THREE.MeshBasicMaterial({ color: 0xff00ff }), // magenta
        new THREE.MeshBasicMaterial({ color: 0x00ffff }), // cyan
    ];

    // Create geometry and mesh with different colored materials
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const model = new THREE.Mesh(geometry, materials);
    scene.add(model);

    // Handle resize
    window.addEventListener('resize', onWindowResize, false);
    animate();
}

function onWindowResize() {
    const container = document.getElementById('3d-container');
    if (camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

function animate() {
    if (renderer && controls) {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
}

export function dispose3D() {
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }

    if (scene) {
        scene.traverse((object) => {
            if (!object.isMesh) return;
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        });
        scene = null;
    }

    if (controls) {
        controls.dispose();
        controls = null;
    }

    const container = document.getElementById('3d-container');
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    window.removeEventListener('resize', onWindowResize);
}
