import * as THREE from 'three/src/Three.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: THREE.PerspectiveCamera,
  scene,
  renderer: THREE.WebGLRenderer,
  controls
let geometry, material, mesh
let dog
let frame = 0

init()
animate()

function init() {
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.01,
    50000
  )
  camera.position.x = 0
  camera.position.y = 1000
  camera.position.z = -1000
  camera.zoom = 100
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  console.log('camera:', camera)

  scene = new THREE.Scene()

  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x3c3c3c
  })
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMaterial)
  plane.rotation.x = -Math.PI / 2
  plane.receiveShadow = true
  scene.add(plane)

  const light = new THREE.DirectionalLight(0xdfebff, 1.0)
  light.position.set(300 * 1.5, 400 * 1.5, 500 * 1.5)
  // light.position.multiplyScalar(1.3)
  light.position.set(10, 30, 10)
  light.castShadow = true // default false
  /*
  const d = 5
  light.shadow.camera.visible = true
  light.shadow.camera.left = -d
  light.shadow.camera.right = d
  light.shadow.camera.top = d
  light.shadow.camera.bottom = -d
  light.shadow.radius = 5
  */
  light.shadow.mapSize.width = 1024
  light.shadow.mapSize.height = 1024
  // light.shadow.camera.near = 0.5
  light.shadow.camera.far = 2000
  scene.add(light)

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.1)
  scene.add(ambientLight)

  const axesHelper = new THREE.AxesHelper(500)
  scene.add(axesHelper)

  // overwrite shadowmap code

  let shader = THREE.ShaderChunk.shadowmap_pars_fragment

  shader = shader.replace(
    '#ifdef USE_SHADOWMAP',
    '#ifdef USE_SHADOWMAP' + document.getElementById('PCSS').textContent
  )

  shader = shader.replace(
    '#if defined( SHADOWMAP_TYPE_PCF )',
    document.getElementById('PCSSGetShadow').textContent +
      '#if defined( SHADOWMAP_TYPE_PCF )'
  )

  THREE.ShaderChunk.shadowmap_pars_fragment = shader

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

  document.body.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)

  loadModel('scene-1-main.mtl', 'scene-1-main.obj')
}

function loadModel(mtlPath: string, objPath: string) {
  const mtlLoader = new MTLLoader()
  mtlLoader.load(mtlPath, mtlParseResult => {
    const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult)
    const objLoader = new OBJLoader2()
    objLoader.addMaterials(materials, true)
    objLoader.load(objPath, obj => {
      console.log(`${objPath}:`, obj)
      obj.position.y = 0
      obj.position.x = 3.5
      obj.receiveShadow = true
      obj.castShadow = true
      // obj.scale.set(1.4, 1.4, 1.4)
      scene.add(obj)
      dog = obj

      scene.traverse(function (child) {
        if (child.isMesh) {
          child.doubleSided = true
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    })
  })
}

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  frame += 0.001
  const r = 20
  camera.position.y = 20
  camera.position.x = r * Math.sin(frame * Math.PI)
  camera.position.z = r * Math.cos(frame * Math.PI)

  camera.lookAt(new THREE.Vector3(0, 0, 0))

  renderer.render(scene, camera)
}
