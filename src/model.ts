import * as THREE from 'three/src/Three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function loadObjModel(
  scene: THREE.Scene,
  mtlPath: string,
  objPath: string,
  options: {
    smooth: boolean
    receiveShadow: boolean
    castShadow: boolean
  } = { smooth: false, receiveShadow: true, castShadow: true }
): Promise<THREE.Object3D> {
  const { smooth, receiveShadow, castShadow } = options
  return new Promise(resolve => {
    const mtlLoader = new MTLLoader()
    mtlLoader.load(mtlPath, mtlParseResult => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult)
      const objLoader = new OBJLoader2()
      objLoader.addMaterials(materials, true)
      objLoader.load(objPath, obj => {
        console.log(`${objPath}:`, obj)
        obj.position.y = 0
        obj.position.x = 3.5
        obj.receiveShadow = receiveShadow
        obj.castShadow = castShadow
        scene.add(obj)

        obj.traverse(function (child: THREE.Mesh) {
          if (child.isMesh) {
            console.log('mesh child:', child)
            child.castShadow = castShadow
            child.receiveShadow = receiveShadow
            console.log('child.geometry:', child.geometry)

            if (smooth && child.geometry instanceof THREE.BufferGeometry) {
              // smooth shading
              const tempGeometry = new THREE.Geometry().fromBufferGeometry(
                child.geometry
              )
              tempGeometry.mergeVertices()
              tempGeometry.computeVertexNormals()
              child.geometry = new THREE.BufferGeometry().fromGeometry(
                tempGeometry
              )
            }
          }
        })

        resolve(obj)
      })
    })
  })
}

export function loadGLTFModel(
  scene: THREE.Scene,
  glbPath: string,
  options: {
    receiveShadow: boolean
    castShadow: boolean
  } = { receiveShadow: true, castShadow: true }
): Promise<THREE.Object3D> {
  const { receiveShadow, castShadow } = options
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()

    loader.load(
      glbPath,
      gltf => {
        console.log('gltf:', gltf)
        const obj = gltf.scene
        obj.name = 'dog'
        obj.position.y = 0
        obj.position.x = 0
        obj.receiveShadow = receiveShadow
        obj.castShadow = castShadow
        scene.add(obj)

        console.log('model:', obj)

        obj.traverse(function (child: THREE.Mesh) {
          if (child.isMesh) {
            child.castShadow = castShadow
            child.receiveShadow = receiveShadow
          }
        })
        resolve(obj)
      },
      undefined,
      function (error) {
        console.error('An error happened:', error)
        reject(error)
      }
    )
  })
}
