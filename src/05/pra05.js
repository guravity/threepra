import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "../helpers/RectAreaLightHelper.js";
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm';

//UIデバッグ
const gui = new GUI();

//サイズ
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);
camera.position.x = -2;
camera.position.y = 1;
camera.position.z = 4;
scene.add(camera);

// ライト→{}で分割代入したいけどできない、、、？

// 周囲光 AmbientLight→光のバウンシングの表現で使う
// const ambientLight = new THREE.AmbientLight({
//     color: "red",
//     intensity: 0.5
// });
// ambientLight.intensity = 0.5 // これはきく
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01)
gui.addColor(ambientLight, "color")

// 平行光 DirectionalLight→影を追加できる
const dirLight = new THREE.DirectionalLight(0xff0fff)
scene.add(dirLight)

// 半球光 HemisphereLight(空色, 地面色)→影は追加できない
const hemLight = new THREE.HemisphereLight(0x0fffff, 0xffff00, 0.5)
scene.add(hemLight)

// ポイント光 PointLight(色, 強度, 距離(光の届く距離), 減衰(しやすさ))
const pointLight = new THREE.PointLight(0x0f0fff, 0.5, 10, 2)
pointLight.position.set(-1, 0, 1.5)
scene.add(pointLight)

// 長方形光 RectAreaLight
const rectLight = new THREE.RectAreaLight(0x0fff0f, 1, 2 ,2)
rectLight.position.set(1.5, 0, 2)
rectLight.lookAt(0,0,0)
// scene.add(rectLight)

// スポット光→SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 0.5, 6, Math.PI*0.1, 0.01, 1)
spotLight.position.set(-1, 2, 3)
spotLight.target.position.x = 2
scene.add(spotLight)
scene.add(spotLight.target) // ターゲットを変えたらsceneに追加する必要。

// ヘルパー
const dirHelper = new THREE.DirectionalLightHelper(dirLight, 0.3)
scene.add(dirHelper)
const pointHelper = new THREE.PointLightHelper(pointLight, 0.3)
scene.add(pointHelper)
const hemHelper = new THREE.HemisphereLightHelper(hemLight, 0.3)
scene.add(hemHelper)
const spotHelper = new THREE.SpotLightHelper(spotLight, )
scene.add(spotHelper)
window.requestAnimationFrame(()=>{ // 特殊！
    spotHelper.update()
})
const rectHelper = new RectAreaLightHelper(rectLight)
scene.add(rectHelper)

//マテリアル
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.3;

//オブジェクト
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
};

// 描画開始
animate()