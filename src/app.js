import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { init, gl, scene, camera, controls } from './init/init';

import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';
import { GUI } from './init/lil-gui.module.min';
import './style.css';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

init();

let gui = new GUI();

// Utiliser ShaderMaterial pour la sphère avec les mêmes shaders et uniforms
const sphere = new THREE.Mesh(
  new THREE.CircleGeometry(3, 30),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    

    // wireframe: true,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uDisplace: { value: 2 },
      uSpread: { value: 1.2 },
      uNoise: { value: 16 },
    },
  })
);



scene.add(sphere);


// Ajout du post-traitement
let composer = new EffectComposer(gl);
composer.addPass(new RenderPass(scene, camera));

// Configuration GUI pour ajuster les paramètres des shaders
gui
  .add(sphere.material.uniforms.uDisplace, 'value', 0, 2, 0.1)
  .name('displacement');
gui.add(sphere.material.uniforms.uSpread, 'value', 0, 2, 0.1).name('spread');
gui.add(sphere.material.uniforms.uNoise, 'value', 10, 25, 0.1).name('noise');

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2,
  0.00001,
  0.01
);

composer.addPass(bloomPass);

const clock = new THREE.Clock();

let animate = () => {
  const elapsedTime = clock.getElapsedTime();
  
  // Mise à jour du temps pour les deux matériaux
  sphere.material.uniforms.uTime.value = elapsedTime;
  sphere.rotation.z = Math.sin(elapsedTime) / 4 + elapsedTime / 20 + 5;


  
  composer.render();
  controls.update();
  requestAnimationFrame(animate);
};

animate();
