import * as THREE from "../build/three.module.js"
import { OrbitControls } from "../jsm/controls/OrbitControls.js";

let scene, camera, renderer, pointLight, mesh, controls; // グローバル変数
let aspectRatio;

let [cursorX, cursorY] = [0, 0];

window.addEventListener("load", init)
window.addEventListener("resize", onWindowResize)
window.addEventListener("mousemove", (event) => {
    cursorX = event.clientX / window.innerWidth - 0.5
    cursorY = event.clientY / window.innerHeight - 0 / 5
})

function init() {
    scene = new THREE.Scene(); // シーン

    aspectRatio = window.innerWidth / window.innerHeight // アスペクト比

    camera = new THREE.PerspectiveCamera( // カメラ
        75, //画角
        aspectRatio,
        0.1, // start
        1000 // end
    )
    camera.position.set(0, 0, 500)

    // マウスカーソル


    renderer = new THREE.WebGLRenderer({ alpha: true }) // レンダラー
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement)

    // カメラ制御
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // animate()内でupdate()呼ぶ必要

    let texture = new THREE.TextureLoader().load('../textures/earth.jpg');

    // オブジェクトの追加
    let ballGeo = new THREE.SphereGeometry(100, 64, 32) //ジオメトリ
    let ballMat = new THREE.MeshPhysicalMaterial({ map: texture }) // マテリアル
    ballMat.wireframe = true
    let ballMesh = new THREE.Mesh(ballGeo, ballMat) // メッシュ化(→ジオメトリ(骨格)+マテリアル(色))
    scene.add(ballMesh) // シーンに追加
    mesh = ballMesh

    // 光源
    let dirLight = new THREE.DirectionalLight(0xffffff, 2) // 平行光源
    dirLight.position.set(1, 1, 1)
    scene.add(dirLight)
    pointLight = new THREE.PointLight(0xffffff, 1) // ポイント光源
    pointLight.position.set(-200, -200, -200)
    scene.add(pointLight)

    let pointLightHelper = new THREE.PointLightHelper(pointLight, 30) // ポイント光源の位置明示
    scene.add(pointLightHelper)

    animate()
}

// ブラウザリサイズに対応
function onWindowResize() {
    renderer.setSize(window.innerWidth, innerHeight)
    aspectRatio = window.innerWidth / window.innerHeight

    if (camera instanceof THREE.PerspectiveCamera)
    {
        camera.aspect = aspectRatio
    } else if (camera instanceof THREE.OrthographicCamera)
    {
        camera.left = -100 * aspectRatio
        camera.right = 100 * aspectRatio
    }

    camera.updateProjectionMatrix() // カメラの設定更新
}


// 点光源の動き
function animate() {
    pointLight.position.set(
        200 * Math.sin(Date.now() / 500),
        200 * Math.sin(Date.now() / 1000),
        200 * Math.sin(Date.now() / 750)
    )
    mesh.rotation.set(
        Math.PI * Date.now() / 5000,
        0,
        0
    )

    // カメラ制御
    // camera.position.set(cursorX * 100, cursorY * 100, 500)
    // camera.position.set(
    //     500 * Math.sin(Math.PI * cursorX),
    //     500 * cursorY,
    //     500 * Math.cos(Math.PI * cursorX)
    // )
    // camera.lookAt(mesh.position)
    controls.update()

    renderer.render(scene, camera); 
    requestAnimationFrame(animate)
}


