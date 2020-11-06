import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'

const params = {
  light: {
    intensity: 1000,
    distance: 20,
    width: 30,
    height: 10,
    rotationSpeed: 0.25
  },
  shadow: {
    noiseIntensity: 1,
    softness: 3,
    pcfSamples: 16 * 3,
    blockerSamples: 16
  }
}

const uniforms = {
  lightSize: { value: new THREE.Vector2() },
  noiseIntensity: { value: 2 },
  softness: { value: 2 },
  roughness: { value: 0 },
  metalness: { value: 0 }
}

const defines = {
  STANDARD: '',
  PCF_SAMPLES: params.shadow.pcfSamples,
  BLOCKER_SAMPLES: params.shadow.blockerSamples
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(0, 0, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.gammaInput = true
renderer.gammaOutput = true
document.body.appendChild(renderer.domElement)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)
scene.add(new THREE.AxesHelper())

const rectLight = new THREE.RectAreaLight(0xffffff, 1.0, 10, 10)
rectLight.position.set(0, 3, 3)
rectLight.castShadow = true
scene.add(rectLight)
rectLight.lookAt(scene.position)

const light = new THREE.DirectionalLight(0xdfebff, 0.4)
light.position.set(300 * 1.5, 400 * 1.5, 500 * 1.5)
// light.position.multiplyScalar(1.3)
light.position.set(10, 30, 10)
light.castShadow = true // default false
const d = 5
light.shadow.camera.visible = true
light.shadow.camera.left = -d
light.shadow.camera.right = d
light.shadow.camera.top = d
light.shadow.camera.bottom = -d
// light.shadow.radius = 4
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
// light.shadow.camera.near = 0.5
light.shadow.camera.far = 2000
scene.add(light)

const lightQuad = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(),
  new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
)
scene.add(lightQuad)

const standardMaterial = new THREE.ShaderMaterial(THREE.ShaderLib.standard)
standardMaterial.uniforms = Object.assign(
  {},
  standardMaterial.uniforms,
  uniforms
)
standardMaterial.defines = defines
standardMaterial.lights = true

// Shadow
/*
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(), standardMaterial)
plane.castShadow = true
plane.receiveShadow = true
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.scale.multiplyScalar(2000)
plane.position.y = -5
scene.add(plane)
*/

loadModel('scene-1-main.mtl', 'scene-1-main.obj')

var animate = function () {
  requestAnimationFrame(animate)
  rectLight.position.normalize().multiplyScalar(params.light.distance)
  rectLight.width = params.light.width
  rectLight.height = params.light.height
  rectLight.intensity =
    params.light.intensity / (rectLight.width * rectLight.height)
  renderer.render(scene, camera)
}

animate()

function loadModel(mtlPath: string, objPath: string) {
  const mtlLoader = new MTLLoader()
  mtlLoader.load(mtlPath, mtlParseResult => {
    const objMaterials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult)
    const objLoader = new OBJLoader2()
    objLoader.addMaterials(objMaterials, true)
    objLoader.load(objPath, obj => {
      console.log(`${objPath}:`, obj)
      obj.position.y = 0
      obj.position.x = 3.5
      obj.receiveShadow = true
      obj.castShadow = true
      // obj.scale.set(1.4, 1.4, 1.4)
      scene.add(obj)

      scene.traverse(function (child) {
        if (child.isMesh) {
          const newMat = standardMaterial.clone()
          newMat.uniforms.diffuse.value.copy(child.material.color)
          newMat.uniforms.roughness.value = 0.25
          newMat.skinning = true
          console.log('child:', child.material.color, child.material)

          child.material = newMat
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    })
  })
}
