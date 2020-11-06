import * as THREE from 'three/src/Three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function loadModel(
  scene: THREE.Scene,
  mtlPath: string,
  objPath: string
): Promise<THREE.Object3D> {
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
        obj.receiveShadow = true
        obj.castShadow = true
        // obj.scale.set(1.4, 1.4, 1.4)
        scene.add(obj)

        obj.traverse(function (child: THREE.Mesh) {
          if (child.isMesh) {
            console.log('mesh child:', child)
            child.castShadow = true
            child.receiveShadow = true
            child.material.flatShading = false
            child.material.needsUpdate = true
            if (child.material.map) child.material.map.anisotropy = 16
            console.log('child.geometry:', child.geometry)
            child.geometry.computeVertexNormals(true)

            /*
            // smooth shading
            const tempGeometry = new THREE.Geometry().fromBufferGeometry(
              child.geometry
            )
            tempGeometry.mergeVertices()
            tempGeometry.computeVertexNormals()
            child.geometry = new THREE.BufferGeometry().fromGeometry(
              tempGeometry
            )
            */
          }
        })

        resolve(obj)
      })
    })
  })
}

export function loadGLTFModel(
  scene: THREE.Scene,
  glbPath: string
): Promise<THREE.Object3D> {
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
        obj.receiveShadow = true
        obj.castShadow = true
        // obj.scale.set(0.4, 0.4, 0.4)
        scene.add(obj)

        console.log('model:', obj)

        obj.traverse(function (child: THREE.Mesh) {
          if (child.isMesh) {
            console.log('mesh child:', child)
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        resolve(obj)
      },
      function (error) {
        console.log('An error happened')
        console.log(error)
        reject(error)
      }
    )
  })
}
