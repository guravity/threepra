// import * as THREE from "three";
import * as THREE from "../build/three.module.js"
import { OrbitControls } from "../jsm/controls/OrbitControls.js";
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm';

let scene, camera, renderer, light, controls; // グローバル変数
const clock = new THREE.Clock();
const gui = new GUI()

window.addEventListener("load", init)
window.addEventListener("resize", onWindowResize)

function init() {

    // シーン
    scene = new THREE.Scene();

    //カメラ
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(1, 1, 2);

    //レンダラー
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    //ジオメトリ
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    //マテリアル
    const material = new THREE.MeshBasicMaterial({
        color: "red",
    });

    //メッシュ化
    const box = new THREE.Mesh(boxGeometry, material);
    scene.add(box);

    // GUIデバッグ add(オブジェクト, 属性)
    const folder_pos = gui.addFolder("Position")
    const folder_rot = gui.addFolder("Rotation")
    const folder_view = gui.addFolder("View")
    folder_pos.add(box.position, "x").min(-3).max(3).step(0.01).name("transfromX")
    folder_pos.add(box.position, "y").min(-3).max(3).step(0.01).name("transfromY")
    folder_pos.add(box.position, "z").min(-3).max(3).step(0.01).name("transfromZ")
    folder_rot.add(box.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01).name("rotateX")
    folder_rot.add(box.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("rotateY")
    folder_rot.add(box.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01).name("rotateZ")
    folder_view.add(box, "visible")
    folder_view.add(material, "wireframe")
    folder_view.addColor(material, "color")

    //ライト
    light = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(light);

    //マウス操作
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    animate()
}

// ブラウザリサイズに対応
function onWindowResize() {
    renderer.setSize(window.innerWidth, innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix() // カメラの設定更新
}

function animate() {
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    //レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

