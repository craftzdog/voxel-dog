import './styles.css'
import * as THREE from 'three/src/Three.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadGLTFModel } from './model'

let stats: Stats
let camera: THREE.PerspectiveCamera
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let controls: OrbitControls

init()
animate()

function init() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.01,
    50000
  )
  camera.position.y = 20
  camera.position.x = 20 * Math.sin(0.2 * Math.PI)
  camera.position.z = 20 * Math.cos(0.2 * Math.PI)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  console.log('camera:', camera)

  scene = new THREE.Scene()

  const ambientLight = new THREE.AmbientLight(0xcccccc, 1)
  scene.add(ambientLight)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)

  // helpers
  const axesHelper = new THREE.AxesHelper(500)
  // scene.add(axesHelper)
  stats = Stats()
  container.appendChild(stats.dom)
  controls = new OrbitControls(camera, renderer.domElement)

  loadGLTFModel(scene, 'dog-baked.glb', {
    receiveShadow: false,
    castShadow: false
  })
}

function animate() {
  requestAnimationFrame(animate)

  stats.update()
  controls.update()

  renderer.render(scene, camera)
}
