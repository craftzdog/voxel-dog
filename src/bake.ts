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
let target: THREE.Vector3
let frame = 0
let initialCameraPosition: THREE.Vector3

init()
animate()

function init() {
  const container = document.createElement('div')
  container.style.width = '300px'
  container.style.height = '300px'
  document.body.appendChild(container)

  target = new THREE.Vector3(-0.5, 1.2, 0)
  initialCameraPosition = new THREE.Vector3(
    20 * Math.sin(0.2 * Math.PI),
    10,
    20 * Math.cos(0.2 * Math.PI)
  )
  camera = new THREE.PerspectiveCamera(
    30,
    container.clientWidth / container.clientHeight,
    0.01,
    50000
  )
  camera.position.copy(initialCameraPosition)
  camera.lookAt(target)

  scene = new THREE.Scene()

  const ambientLight = new THREE.AmbientLight(0xcccccc, 1)
  scene.add(ambientLight)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)

  // helpers
  stats = Stats()
  container.appendChild(stats.dom)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.autoRotate = true
  controls.target = target

  loadGLTFModel(scene, 'dog-baked.glb', {
    receiveShadow: false,
    castShadow: false
  })
}

function animate() {
  requestAnimationFrame(animate)

  frame = frame <= 100 ? frame + 1 : frame

  if (frame <= 100) {
    const invF = 100 - frame
    const p = initialCameraPosition
    const rotSpeed = (invF * invF) / 300

    camera.position.y = 10
    camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
    camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
    camera.lookAt(target)
  } else {
    controls.update()
  }

  stats.update()

  renderer.render(scene, camera)
}
