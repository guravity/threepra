// import * as THREE from "three";
import * as THREE from "../build/three.module.js"
import { OrbitControls } from "../jsm/controls/OrbitControls.js";

let scene, camera, renderer, light, controls; // グローバル変数
const clock = new THREE.Clock(); // クロック

window.addEventListener("load", init)
window.addEventListener("resize", onWindowResize)

function init() {
    //シーン
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

    //マテリアル
    const mat = new THREE.MeshNormalMaterial({
        wireframe: true,
    });

    let geos = []; // ジオメトリ
    geos.push(new THREE.BoxGeometry(1, 1, 1, 3, 3, 3))
    geos.push(new THREE.SphereGeometry(0.5, 32, 16))
    geos.push(new THREE.PlaneGeometry(10, 10))
    geos.push(new THREE.TorusGeometry(0.5, 0.25, 10, 100, Math.PI * 2))

    let meshs = []; // メッシュ from ジオメトリ+マテリアル

    geos.forEach(function (geo) {
        meshs.push(new THREE.Mesh(geo, mat))
    })
    meshs[1].position.x = 1.5 // sphereメッシュの中心を移動
    meshs[2].rotation.x = -Math.PI * 0.5 // planeをx軸周りに回転
    meshs[2].position.y = -0.5 // plane移動
    meshs[3].position.x = -1.5
    meshs[3].position.y = 0.125

    // シーンに追加
    scene.add(...meshs)

    // バッファジオメトリ
    const bufGeo = new THREE.BufferGeometry()

    // 複数個のとき
    const count = 500;
    const posArrs = new Float32Array(9 * count) // 座標数3×頂点数3×ジオメトリ数50
    for(let i=0;i<count*9;i++){
        posArrs[i] = (Math.random() - 0.5) * 2
    } 
    const posAttrs = new THREE.BufferAttribute(posArrs, 3)
    bufGeo.setAttribute("position", posAttrs)
    
    // 1個のとき
    // const posArr = new Float32Array([
    //     0, 0, 0,
    //     0, 1, 0,
    //     1, 0, 0
    // ]); // 中心位置の型付け配列(拡張点のx,y,z座標)
    // const posAttr = new THREE.BufferAttribute(posArr, 3)
    // bufGeo.setAttribute("position", posAttr)
    // メッシュ化
    const bufMesh = new THREE.Mesh(bufGeo, new THREE.MeshBasicMaterial({wireframe:true}))
    bufMesh.position.y = 2
    scene.add(bufMesh)


    //ライト
    light = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(light);

    //マウス操作
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;



    // 描画開始
    animate();
}


function animate() {
    const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime);

    //オブジェクトの回転
    // sphere.rotation.x = elapsedTime;
    // plane.rotation.x = elapsedTime;
    // octahedron.rotation.x = elapsedTime;
    // torus.rotation.x = elapsedTime;

    // sphere.rotation.y = elapsedTime;
    // plane.rotation.y = elapsedTime;
    // octahedron.rotation.y = elapsedTime;

    // torus.rotation.y = elapsedTime;

    controls.update();

    //レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// ブラウザリサイズに対応
function onWindowResize() {
    renderer.setSize(window.innerWidth, innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix() // カメラの設定更新
}



