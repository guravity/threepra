// import * as THREE from "three";
import * as THREE from "../build/three.module.js"
import { OrbitControls } from "../jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, sphere, plane, oct; // グローバル変数
const clock = new THREE.Clock();

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
    const sphereGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const sphereGeo2 = new THREE.SphereGeometry(0.5, 16, 16);
    const sphereGeo3 = new THREE.SphereGeometry(0.5, 16, 16);
    const planeGeo= new THREE.PlaneGeometry(1, 1);
    const octGeo = new THREE.OctahedronGeometry(0.5);

    // テクスチャ
    const texture = new THREE.TextureLoader().load("../textures/brick.jpg")

    //マテリアル
    // const mat = new THREE.MeshBasicMaterial({
    //     map: texture,
    //     color: "red",
    //     side: 2,
    //     // opacity: 0.5,
    //     // transparent: true,
    // });
    // const mat_normal = new THREE.MeshNormalMaterial({
    //     flatShading: true
    // })
    const mat_std = new THREE.MeshStandardMaterial({ // PBL 光必要
        color: 0x049ef4,
        roughness: 0., // 粗さ
        metalness: 0.5, // 金属っぽさ
    })
    const mat_phong = new THREE.MeshPhongMaterial({ // Phong
        color: 0x049ef4,
        shininess: 100, // 反射率みたいな
        specular: 'red', // 反射色
    })
    const mat_toon = new THREE.MeshToonMaterial({
        color: 0x049ef4,
    })

    // メッシュ化
    sphere = new THREE.Mesh(sphereGeo, mat_phong)
    plane = new THREE.Mesh(planeGeo, mat_phong)
    oct = new THREE.Mesh(octGeo, mat_phong)

    sphere.position.x = 1.5
    oct.position.x = -1.5
    scene.add(sphere, plane, oct);

    const sphere2 = new THREE.Mesh(sphereGeo2, mat_std)
    const sphere3 = new THREE.Mesh(sphereGeo3, mat_toon)
    sphere2.position.set(1.5, 1.5, 0)
    sphere3.position.set(1.5, -1.5, 0)
    scene.add(sphere2, sphere3);

    // ライト
    const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
    const pntLight = new THREE.PointLight(0xffffff, 0.7)
    const pntLightHelper = new THREE.PointLightHelper(pntLight)

    pntLight.position.set(1,2,3)
    scene.add(ambLight, pntLight, pntLightHelper);

    

    

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
    
    sphere.rotation.x = elapsedTime
    plane.rotation.x = elapsedTime
    oct.rotation.x = elapsedTime

    sphere.rotation.y = elapsedTime / 2
    plane.rotation.y = elapsedTime / 2
    oct.rotation.y = elapsedTime / 2


    controls.update();

    //レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

