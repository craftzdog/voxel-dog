import * as THREE from 'three/src/Three.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadModel, loadGLTFModel } from './model'

let stats
let camera, scene, renderer: THREE.WebGLRenderer

let group

init()

function init() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  // scene

  scene = new THREE.Scene()

  // camera

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    10000
  )

  // We use this particular camera position in order to expose a bug that can sometimes happen presumably
  // due to lack of precision when interpolating values over really large triangles.
  // It reproduced on at least NVIDIA GTX 1080 and GTX 1050 Ti GPUs when the ground plane was not
  // subdivided into segments.
  camera.position.x = 7
  camera.position.y = 13
  camera.position.z = 7

  scene.add(camera)

  // lights

  scene.add(new THREE.AmbientLight(0xffffff, 0.2))

  const light = new THREE.DirectionalLight(0xffffff, 1.4)
  light.position.set(4, 7, 4)

  light.castShadow = true
  // light.shadow.bias = -0.0001
  light.shadow.mapSize.width = 1024
  light.shadow.mapSize.height = 1024
  light.shadow.camera.far = 20

  scene.add(light)

  // scene.add( new DirectionalLightHelper( light ) );
  // scene.add(new THREE.CameraHelper(light.shadow.camera))

  // group

  group = new THREE.Group()
  scene.add(group)

  const geometry = new THREE.SphereBufferGeometry(0.3, 20, 20)

  /*
  for (let i = 0; i < 20; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    })

    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.x = Math.random() - 0.5
    sphere.position.z = Math.random() - 0.5
    sphere.position.normalize()
    sphere.position.multiplyScalar(Math.random() * 2 + 1)
    sphere.castShadow = true
    sphere.receiveShadow = true
    sphere.userData.phase = Math.random() * Math.PI
    group.add(sphere)
  }
  */

  // ground

  const groundMaterial = new THREE.ShadowMaterial({
    color: 0x000b0b,
    transparent: true,
    opacity: 1.0
  })

  const ground = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10, 1, 1),
    groundMaterial
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

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

  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true

  // controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minPolarAngle = Math.PI * 0.2
  controls.maxPolarAngle = Math.PI * 0.4
  controls.minDistance = 10
  controls.maxDistance = 75
  controls.enableDamping = true
  controls.target.set(0, 0, 0)
  controls.update()

  // loadModel(scene, 'scene-1-main.mtl', 'scene-1-main.obj')
  loadGLTFModel(scene, 'dog.glb')

  // performance monitor

  stats = new Stats()
  container.appendChild(stats.dom)
  animate()

  //

  window.addEventListener('resize', onWindowResize, false)

  //

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  //

  function animate() {
    renderer.render(scene, camera)
    stats.update()
    controls.update()

    requestAnimationFrame(animate)
  }
}
