import * as THREE from 'three/src/Three.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

let container, stats
let camera, scene, renderer

init()
animate()

function init() {
  container = document.createElement('div')
  document.body.appendChild(container)

  // CAMERA

  camera = new THREE.PerspectiveCamera(
    40,
    SCREEN_WIDTH / SCREEN_HEIGHT,
    1,
    10000
  )
  camera.position.set(700, 200, -500)

  // SCENE

  scene = new THREE.Scene()

  // LIGHTS

  const light = new THREE.DirectionalLight(0xaabbff, 0.3)
  light.position.x = 300
  light.position.y = 250
  light.position.z = -500
  scene.add(light)

  // SKYDOME

  const vertexShader = document.getElementById('vertexShader').textContent
  const fragmentShader = document.getElementById('fragmentShader').textContent
  const uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 400 },
    exponent: { value: 0.6 }
  }
  uniforms.topColor.value.copy(light.color)

  const skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15)
  const skyMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide
  })

  const sky = new THREE.Mesh(skyGeo, skyMat)
  scene.add(sky)

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  container.appendChild(renderer.domElement)
  renderer.outputEncoding = THREE.sRGBEncoding

  // CONTROLS

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.maxPolarAngle = (0.9 * Math.PI) / 2
  controls.enableZoom = false

  // STATS

  stats = new Stats()
  container.appendChild(stats.dom)

  // MODEL

  const loader = new THREE.ObjectLoader()
  loader.load('lightmap.json', function (object) {
    scene.add(object)
  })

  //

  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

//

function animate() {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
  stats.update()
}
