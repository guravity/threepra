import * as THREE from "three";
import { OrbitControls } from "../jsm/controls/OrbitControls.js";

let scene, camera, renderer, pointLight, controls; // グローバル変数

window.addEventListener("load", init)
window.addEventListener("resize", onWindowResize)

function init() {
    scene = new THREE.Scene(); // シーンのインスタンス化

    camera = new THREE.PerspectiveCamera( // カメラの追加（視野角, アスペクト比, 開始距離, 終了距離）
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.set(0, 0, 500)

    renderer = new THREE.WebGLRenderer({ alpha: true }) // レンダラー
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio) // 解像度の調整
    document.body.appendChild(renderer.domElement) // DOMに追加

    controls = new OrbitControls(camera, renderer.domElement) // カメラのマウス操作

    let texture = new THREE.TextureLoader().load('../textures/earth.jpg'); // テクスチャ

    // オブジェクトの追加
    let ballGeo = new THREE.SphereGeometry(100, 64, 32) //ジオメトリ
    let ballMat = new THREE.MeshPhysicalMaterial({ map: texture }) // マテリアル
    let ballMesh = new THREE.Mesh(ballGeo, ballMat) // メッシュ化(→ジオメトリ(骨格)+マテリアル(色))
    scene.add(ballMesh) // シーンに追加

    // 光源
    let dirLight = new THREE.DirectionalLight(0xffffff, 2) // 平行光源
    dirLight.position.set(1, 1, 1) // 方向ベクトル(の逆。光がある方向。)
    scene.add(dirLight)

    pointLight = new THREE.PointLight(0xffffff, 1) // ポイント光源
    pointLight.position.set(-200, -200, -200)
    scene.add(pointLight)

    let pointLightHelper = new THREE.PointLightHelper(pointLight, 30) // ポイント光源の位置明示
    scene.add(pointLightHelper)
    /*
    let dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 30) // 平行光源の位置明示
    scene.add(dirLightHelper)
    */
    /* 赤と青
    let dirLight1 = new THREE.DirectionalLight(0xff0000, 2)
    dirLight1.position.set(1,1,1)
    scene.add(dirLight1)
    
    let dirLight2 = new THREE.DirectionalLight(0x0000ff, 1)
    dirLight2.position.set(0, 0, 1)
    
    scene.add(dirLight2)
    */

    animate()
}

// ブラウザリサイズに対応
function onWindowResize(){
    renderer.setSize(window.innerWidth, innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix() // カメラの設定更新
}


// 点光源の動き
function animate() {
    pointLight.position.set(
        200 * Math.sin(Date.now() / 500),
        200 * Math.sin(Date.now() / 1000),
        200 * Math.sin(Date.now() / 750)
    )

    renderer.render(scene, camera); // レンダー
    requestAnimationFrame(animate) // 再描画の準備が整い次第animate関数を呼ぶ→毎フレームごと
}


