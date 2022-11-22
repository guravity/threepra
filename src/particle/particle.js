import * as THREE from "../build/three.module.js"
import { OrbitControls } from "../jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls;
let aspectRatio = window.innerWidth / window.innerHeight;
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
let particleGeometry
const count = 5000; // パーティクル数
const clock = new THREE.Clock();

window.addEventListener("load", init)
window.addEventListener("resize", onWindowResize)

function init() {


    //シーン
    scene = new THREE.Scene();

    //カメラ
    camera = new THREE.PerspectiveCamera(
        75,
        aspectRatio,
        0.1,
        100
    );
    camera.position.set(1, 1, 10);

    //レンダラー
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // texure
    const textureLoader = new THREE.TextureLoader()
    const particlesTexture = textureLoader.load("../textures/particles/1.png")

    // パーティクル
    particleGeometry = new THREE.BufferGeometry();

    const posArr = new Float32Array(count * 3); // 頂点座標 (頂点数x3)
    const colorArr = new Float32Array(count * 3); // 色情報
    for (let i = 0; i < count * 3; i++)
    {
        posArr[i] = (Math.random() - 0.5) * 10;
        colorArr[i] = Math.random();
    }


    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArr, 3)
    )
    particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colorArr, 3)
    )

    // material
    const pointMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true, // カメラとの距離で大きさの変化
        transparent: true,
        alphaMap: particlesTexture, // 不透明度制御のグレースケールテクスチャ
        // alphaTest: 0.01, // 不透明度のしきい値(デフォルトはゼロ)
        // depthTest: false, // 他のメッシュに関係なく描画されてしまう。
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending, // 重なっていると明るくなる
    });

    const particles = new THREE.Points(particleGeometry, pointMaterial)
    scene.add(particles)

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2),
        new THREE.MeshNormalMaterial(),
    )
    // scene.add(sphere)

    //マウス操作
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    animate();
}

// ブラウザリサイズに対応
function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    aspectRatio = window.innerWidth / window.innerHeight;
    [sizes.width, sizes.height] = [window.innerWidth, window.innerHeight];

    if (camera instanceof THREE.PerspectiveCamera)
    {
        camera.aspect = aspectRatio;
    } else if (camera instanceof THREE.OrthographicCamera)
    {
        camera.left = -100 * aspectRatio;
        camera.right = 100 * aspectRatio;
    }

    camera.updateProjectionMatrix()
}


function animate() {
    const t = clock.getElapsedTime();

    // for (let i = 0; i < count; i++) // 平面波
    // {
    //     let i3 = i*3
    //     let x = particleGeometry.attributes.position.array[i3] // x座標値
    //     particleGeometry.attributes.position.array[i3+1] = 3 * Math.sin(2*Math.PI*(x/5-t/5)) // 波長5 周期5s 位相速度1/s
    // }
    for (let i = 0; i < count; i++) // 円形波
    {
        let i3 = i*3
        let x = particleGeometry.attributes.position.array[i3] // x座標値
        let z = particleGeometry.attributes.position.array[i3+2] // z座標値
        particleGeometry.attributes.position.array[i3+1] = 3 * Math.sin(2*Math.PI*(Math.sqrt(x**2+z**2)/5-t/5)) // 波長5 周期5s 位相速度1/s
    }
    particleGeometry.attributes.position.needsUpdate = true

    controls.update();

    renderer.render(scene, camera); // レンダー
    requestAnimationFrame(animate); // 再描画の準備が整い次第animate関数を呼ぶ→毎フレームごと
}


