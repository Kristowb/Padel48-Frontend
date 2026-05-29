<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'

const emit = defineEmits(['select-feature'])

// 3D & Performance States
const use3D = ref(true)
const webglSupported = ref(true)
const loading3D = ref(true)
const canvasContainer = ref(null)
const activeTooltip = ref(null) // { text: '', x: 0, y: 0 }

const featureKeyMap = {
  'turf': 0,
  'glass': 1,
  'net': 2,
  'mesh': 3,
  'lamp': 4
}

// Three.js variables
let scene, camera, renderer, animationFrameId
let courtGroup, interactiveObjects = []

// Check WebGL Support
const checkWebGL = () => {
  try {
    const canvas = document.createElement('canvas')
    const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
    webglSupported.value = support
    return support
  } catch (e) {
    webglSupported.value = false
    return false
  }
}

// Initializing Three.js Padel Court Model
const initThree = () => {
  if (!canvasContainer.value) return

  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  // 1. Scene setup
  scene = new THREE.Scene()
  scene.background = new THREE.Color('#003B36') // Hijau botol gelap

  // 2. Camera setup
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
  camera.position.set(13, 10, 19)
  camera.lookAt(0, 0.5, 0)

  // 3. Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  canvasContainer.value.appendChild(renderer.domElement)

  // 4. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(5, 15, 5)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 1024
  dirLight.shadow.mapSize.height = 1024
  scene.add(dirLight)

  const warmBacklight = new THREE.DirectionalLight(0xfff8e7, 0.3)
  warmBacklight.position.set(-10, 5, -10)
  scene.add(warmBacklight)

  // 5. Group for Court
  courtGroup = new THREE.Group()
  scene.add(courtGroup)

  // --- Court Modeling Primitives ---

  // A. Turf
  const turfGeo = new THREE.BoxGeometry(10, 0.2, 20)
  const turfMat = new THREE.MeshStandardMaterial({ 
    color: 0x00473e,
    roughness: 0.9,
    metalness: 0.1
  })
  const turfMesh = new THREE.Mesh(turfGeo, turfMat)
  turfMesh.receiveShadow = true
  turfMesh.position.y = -0.1
  turfMesh.userData = { 
    type: 'turf', 
    title: 'Turf Lapangan Hijau Premium', 
    desc: 'Rumput sintetis monofilamen premium berdensitas tinggi berwarna hijau lapangan botol. Memberikan cengkeraman kaki yang optimal dan pantulan bola konsisten.',
    img: '/indoor_court.png'
  }
  courtGroup.add(turfMesh)
  interactiveObjects.push(turfMesh)

  // B. Court Line Markings
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  const lineThickness = 0.08
  
  const outlineX1 = new THREE.Mesh(new THREE.PlaneGeometry(lineThickness, 20), lineMaterial)
  outlineX1.rotation.x = -Math.PI / 2
  outlineX1.position.set(-4.9, 0.01, 0)
  courtGroup.add(outlineX1)

  const outlineX2 = outlineX1.clone()
  outlineX2.position.x = 4.9
  courtGroup.add(outlineX2)

  const outlineZ1 = new THREE.Mesh(new THREE.PlaneGeometry(10, lineThickness), lineMaterial)
  outlineZ1.rotation.x = -Math.PI / 2
  outlineZ1.position.set(0, 0.01, -9.9)
  courtGroup.add(outlineZ1)

  const outlineZ2 = outlineZ1.clone()
  outlineZ2.position.z = 9.9
  courtGroup.add(outlineZ2)

  const serviceLine1 = new THREE.Mesh(new THREE.PlaneGeometry(9.8, lineThickness), lineMaterial)
  serviceLine1.rotation.x = -Math.PI / 2
  serviceLine1.position.set(0, 0.01, -6.95)
  courtGroup.add(serviceLine1)

  const serviceLine2 = serviceLine1.clone()
  serviceLine2.position.z = 6.95
  courtGroup.add(serviceLine2)

  const centerLine = new THREE.Mesh(new THREE.PlaneGeometry(lineThickness, 13.9), lineMaterial)
  centerLine.rotation.x = -Math.PI / 2
  centerLine.position.set(0, 0.01, 0)
  courtGroup.add(centerLine)

  // C. Net
  const netHeight = 0.88
  const netGroup = new THREE.Group()

  const netGeo = new THREE.BoxGeometry(10, netHeight - 0.08, 0.02)
  const netMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    transparent: true,
    opacity: 0.75,
    roughness: 0.9
  })
  const netMesh = new THREE.Mesh(netGeo, netMat)
  netMesh.position.y = (netHeight - 0.08) / 2
  netGroup.add(netMesh)

  const bandGeo = new THREE.BoxGeometry(10.02, 0.08, 0.04)
  const bandMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  const bandMesh = new THREE.Mesh(bandGeo, bandMat)
  bandMesh.position.y = netHeight - 0.04
  netGroup.add(bandMesh)

  const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 16)
  const postMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.4 })
  
  const postL = new THREE.Mesh(postGeo, postMat)
  postL.position.set(-5.0, 0.5, 0)
  netGroup.add(postL)
  
  const postR = postL.clone()
  postR.position.x = 5.0
  netGroup.add(postR)

  netMesh.userData = { 
    type: 'net', 
    title: 'Net Padel Regulasi WPT', 
    desc: 'Net dengan anyaman hitam berdensitas tinggi dilengkapi pita putih atas berukuran 8 cm. Ketegangan jaring diatur presisi dengan tinggi tiang penahan 92 cm.',
    img: '/hero.png'
  }
  courtGroup.add(netGroup)
  interactiveObjects.push(netMesh)

  // D. Black Structural Metal Pillars
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7, metalness: 0.5 })
  const pillarGeo = new THREE.BoxGeometry(0.12, 3.0, 0.12)
  const pillars = [
    [-5, 1.5, -10], [5, 1.5, -10],
    [-5, 1.5, -8], [5, 1.5, -8],
    [-5, 1.5, -6], [5, 1.5, -6],
    [-5, 1.5, 6], [5, 1.5, 6],
    [-5, 1.5, 8], [5, 1.5, 8],
    [-5, 1.5, 10], [5, 1.5, 10],
    [-3, 1.5, -10], [3, 1.5, -10],
    [-3, 1.5, 10], [3, 1.5, 10]
  ]
  pillars.forEach(([px, py, pz]) => {
    const pillar = new THREE.Mesh(pillarGeo, pillarMat)
    pillar.position.set(px, py, pz)
    courtGroup.add(pillar)
  })

  const hFrameGeoX = new THREE.BoxGeometry(10, 0.08, 0.08)
  const frameTopBack = new THREE.Mesh(hFrameGeoX, pillarMat)
  frameTopBack.position.set(0, 3.0, -10)
  courtGroup.add(frameTopBack)

  const frameTopFront = frameTopBack.clone()
  frameTopFront.position.z = 10
  courtGroup.add(frameTopFront)

  // E. Tempered Glass Walls
  const glassGeoX = new THREE.BoxGeometry(9.88, 3.0, 0.08)
  const glassGeoZ = new THREE.BoxGeometry(0.08, 3.0, 3.9)
  const glassMat = new THREE.MeshStandardMaterial({ 
    color: 0x88ccff, 
    transparent: true, 
    opacity: 0.2, 
    roughness: 0.05, 
    metalness: 0.95 
  })

  const glassBack = new THREE.Mesh(glassGeoX, glassMat)
  glassBack.position.set(0, 1.5, -9.96)
  glassBack.userData = { 
    type: 'glass', 
    title: 'Kaca Tempered Panoramik 12mm', 
    desc: 'Dinding kaca tempered tanpa bingkai dalam (panoramik) setinggi 3 meter. Memberikan pandangan maksimal bagi penonton serta pantulan bola yang presisi tanpa distorsi.',
    img: '/outdoor_court.png'
  }
  courtGroup.add(glassBack)
  interactiveObjects.push(glassBack)

  const glassFront = glassBack.clone()
  glassFront.position.z = 9.96
  courtGroup.add(glassFront)
  interactiveObjects.push(glassFront)

  const glassSideBL = new THREE.Mesh(glassGeoZ, glassMat)
  glassSideBL.position.set(-4.96, 1.5, -8.0)
  courtGroup.add(glassSideBL)
  interactiveObjects.push(glassSideBL)

  const glassSideBR = glassSideBL.clone()
  glassSideBR.position.x = 4.96
  courtGroup.add(glassSideBR)
  interactiveObjects.push(glassSideBR)

  const glassSideFL = glassSideBL.clone()
  glassSideFL.position.z = 8.0
  courtGroup.add(glassSideFL)
  interactiveObjects.push(glassSideFL)

  const glassSideFR = glassSideBR.clone()
  glassSideFR.position.z = 8.0
  courtGroup.add(glassSideFR)
  interactiveObjects.push(glassSideFR)

  // F. Metal Mesh Fence
  const fenceGeo = new THREE.BoxGeometry(0.02, 2.0, 12.0)
  const fenceMat = new THREE.MeshStandardMaterial({ 
    color: 0x222222, 
    transparent: true, 
    opacity: 0.35, 
    roughness: 0.8,
    metalness: 0.4
  })
  
  const fenceL = new THREE.Mesh(fenceGeo, fenceMat)
  fenceL.position.set(-4.98, 1.0, 0)
  fenceL.userData = { 
    type: 'mesh', 
    title: 'Pagar Kawat Mesh Baja Hitam', 
    desc: 'Pagar jaring kawat baja kokoh anti-korosi setinggi 2 meter di bagian tengah sisi samping lapangan. Memungkinkan pantulan bola acak yang memicu teknik permainan dinamis.',
    img: '/indoor_court.png'
  }
  courtGroup.add(fenceL)
  interactiveObjects.push(fenceL)

  const fenceR = fenceL.clone()
  fenceR.position.x = 4.98
  courtGroup.add(fenceR)
  interactiveObjects.push(fenceR)

  const gridHelperL = new THREE.GridHelper(12, 24, 0x111111, 0x1a1a1a)
  gridHelperL.rotation.z = Math.PI / 2
  gridHelperL.position.set(-4.97, 1.0, 0)
  gridHelperL.scale.set(0.16, 1, 1)
  courtGroup.add(gridHelperL)

  const gridHelperR = gridHelperL.clone()
  gridHelperR.position.x = 4.97
  courtGroup.add(gridHelperR)

  // H. Angled Light Posts
  const lightPostMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, metalness: 0.8, roughness: 0.2 })
  const lightPosts = [
    [-5.2, -4], [-5.2, 4],
    [5.2, -4], [5.2, 4]
  ]

  lightPosts.forEach(([lx, lz]) => {
    const postGroup = new THREE.Group()
    postGroup.position.set(lx, 0, lz)

    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.0, 16)
    const pole = new THREE.Mesh(poleGeo, lightPostMat)
    pole.position.y = 2.5
    postGroup.add(pole)

    const armGeo = new THREE.BoxGeometry(1.2, 0.08, 0.08)
    const arm = new THREE.Mesh(armGeo, lightPostMat)
    arm.position.set(lx < 0 ? 0.4 : -0.4, 5.0, 0)
    arm.rotation.z = lx < 0 ? -Math.PI / 6 : Math.PI / 6
    postGroup.add(arm)

    const lightBoxGeo = new THREE.BoxGeometry(0.6, 0.1, 0.3)
    const lightBoxMat = new THREE.MeshStandardMaterial({ color: 0x333333 })
    const lightBox = new THREE.Mesh(lightBoxGeo, lightBoxMat)
    lightBox.position.set(lx < 0 ? 0.9 : -0.9, 5.15, 0)
    lightBox.rotation.z = lx < 0 ? -Math.PI / 6 : Math.PI / 6
    postGroup.add(lightBox)

    const emitterGeo = new THREE.BoxGeometry(0.56, 0.02, 0.26)
    const emitterMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const emitter = new THREE.Mesh(emitterGeo, emitterMat)
    emitter.position.set(lx < 0 ? 0.9 : -0.9, 5.09, 0)
    emitter.rotation.z = lx < 0 ? -Math.PI / 6 : Math.PI / 6
    postGroup.add(emitter)

    const postLight = new THREE.SpotLight(0xffffff, 2.5, 15, Math.PI / 4, 0.5, 1)
    postLight.position.set(lx < 0 ? 0.9 : -0.9, 5.0, 0)
    postLight.target = turfMesh
    postGroup.add(postLight)

    pole.userData = {
      type: 'lamp',
      title: 'Lampu LED Sorot 500 Lux',
      desc: 'Sistem pencahayaan 4 tiang LED sorot asimetris anti-silau. Memancarkan tingkat kecerahan cahaya minimal 500 lux merata di seluruh permukaan lapangan.',
      img: '/indoor_court.png'
    }
    courtGroup.add(postGroup)
    interactiveObjects.push(pole)
  })

  // --- Interaction Listeners ---
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let hoveredObj = null
  let fpsTimer = 0
  let frames = 0
  let lastTime = performance.now()

  let isDragging = false
  let prevMousePos = { x: 0, y: 0 }

  const onMouseDown = (e) => {
    isDragging = true
    prevMousePos = { x: e.clientX, y: e.clientY }
  }

  const onMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - prevMousePos.x
      const deltaY = e.clientY - prevMousePos.y
      courtGroup.rotation.y += deltaX * 0.007
      courtGroup.rotation.x += deltaY * 0.005
      courtGroup.rotation.x = Math.max(-0.6, Math.min(0.6, courtGroup.rotation.x))
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(interactiveObjects)

    if (intersects.length > 0) {
      const obj = intersects[0].object
      if (hoveredObj !== obj) {
        if (hoveredObj) resetColor(hoveredObj)
        hoveredObj = obj
        highlightObject(obj)
      }
      
      canvasContainer.value.style.cursor = 'pointer'
      const xPos = e.clientX - rect.left
      const yPos = e.clientY - rect.top
      activeTooltip.value = {
        text: obj.userData.title,
        x: xPos,
        y: yPos - 35
      }
    } else {
      if (hoveredObj) {
        resetColor(hoveredObj)
        hoveredObj = null
      }
      canvasContainer.value.style.cursor = 'default'
      activeTooltip.value = null
    }
  }

  const onMouseUp = () => {
    isDragging = false
  }

  const onClick = (e) => {
    if (isDragging) return
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(interactiveObjects)

    if (intersects.length > 0) {
      const obj = intersects[0].object
      const featureIndex = featureKeyMap[obj.userData.type]
      emit('select-feature', {
        title: obj.userData.title,
        desc: obj.userData.desc,
        img: obj.userData.img,
        index: featureIndex
      })
    }
  }

  canvasContainer.value.addEventListener('mousedown', onMouseDown)
  canvasContainer.value.addEventListener('mousemove', onMouseMove)
  canvasContainer.value.addEventListener('mouseup', onMouseUp)
  canvasContainer.value.addEventListener('click', onClick)

  initThree.cleanupListeners = () => {
    if (canvasContainer.value) {
      canvasContainer.value.removeEventListener('mousedown', onMouseDown)
      canvasContainer.value.removeEventListener('mousemove', onMouseMove)
      canvasContainer.value.removeEventListener('mouseup', onMouseUp)
      canvasContainer.value.removeEventListener('click', onClick)
    }
  }

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    if (!isDragging) {
      courtGroup.rotation.y += 0.003
    }

    renderer.render(scene, camera)

    frames++
    const time = performance.now()
    if (time >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (time - lastTime))
      if (fps < 20) {
        fpsTimer++
        if (fpsTimer >= 3) {
          console.warn("FPS rendah terdeteksi. Beralih secara otomatis ke visualisasi 2D.")
          use3D.value = false
          cancelAnimationFrame(animationFrameId)
        }
      } else {
        fpsTimer = 0
      }
      frames = 0
      lastTime = time
    }
  }

  animate()
  loading3D.value = false
}

const highlightObject = (obj) => {
  if (obj.userData.type === 'turf') {
    obj.material.color.setHex(0x006659)
  } else if (obj.userData.type === 'net') {
    obj.material.color.setHex(0x444444)
  } else if (obj.userData.type === 'glass') {
    obj.material.opacity = 0.5
    obj.material.color.setHex(0xccff00)
  } else if (obj.userData.type === 'mesh') {
    obj.material.opacity = 0.7
    obj.material.color.setHex(0xccff00)
  } else if (obj.userData.type === 'lamp') {
    obj.material.color.setHex(0xccff00)
  }
}

const resetColor = (obj) => {
  if (obj.userData.type === 'turf') {
    obj.material.color.setHex(0x00473e)
  } else if (obj.userData.type === 'net') {
    obj.material.color.setHex(0x1a1a1a)
  } else if (obj.userData.type === 'glass') {
    obj.material.opacity = 0.2
    obj.material.color.setHex(0x88ccff)
  } else if (obj.userData.type === 'mesh') {
    obj.material.opacity = 0.35
    obj.material.color.setHex(0x222222)
  } else if (obj.userData.type === 'lamp') {
    obj.material.color.setHex(0x1e1e1e)
  }
}

const handleResize = () => {
  if (!use3D.value || !canvasContainer.value || !renderer || !camera) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const toggleViewMode = () => {
  use3D.value = !use3D.value
  if (use3D.value) {
    loading3D.value = true
    nextTick(() => {
      if (checkWebGL()) {
        initThree()
      } else {
        use3D.value = false
      }
    })
  } else {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    if (initThree.cleanupListeners) initThree.cleanupListeners()
    if (renderer && renderer.domElement && canvasContainer.value) {
      canvasContainer.value.innerHTML = ''
    }
  }
}

const selectFeature2D = (key, data) => {
  emit('select-feature', {
    ...data,
    index: featureKeyMap[key]
  })
}

onMounted(() => {
  setTimeout(() => {
    if (checkWebGL()) {
      initThree()
      window.addEventListener('resize', handleResize)
    } else {
      use3D.value = false
    }
  }, 600)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (initThree.cleanupListeners) initThree.cleanupListeners()
})
</script>

<template>
  <div
    class="relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl flex flex-col justify-between"
  >
    <!-- Toggle Tampilan 3D / 2D -->
    <div class="absolute top-4 right-4 z-20">
      <button
        @click="toggleViewMode"
        class="px-4 py-1.5 rounded-full bg-padel-dark/75 backdrop-blur-md hover:bg-padel-teal text-white hover:text-padel-dark text-[10px] font-bold border border-white/10 hover:border-padel-teal transition-all duration-300 shadow cursor-pointer"
      >
        {{ use3D && webglSupported ? 'Beralih ke Tampilan 2D' : 'Beralih ke Tampilan 3D' }}
      </button>
    </div>

    <!-- 1. TAMPILAN 3D (Three.js Canvas) -->
    <div v-show="use3D && webglSupported" class="relative w-full h-full">
      <!-- Skeletal Shimmer Loading State -->
      <div
        v-if="loading3D"
        class="absolute inset-0 flex flex-col justify-center items-center bg-padel-dark/80 backdrop-blur-xl space-y-4 z-10"
      >
        <div
          class="w-64 h-36 bg-white/5 rounded-xl relative overflow-hidden border border-white/10 flex items-center justify-center"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"
          ></div>
          <div class="w-px h-full bg-white/10 absolute left-1/2"></div>
          <div class="w-10 h-10 border border-white/10 rounded-full"></div>
        </div>
        <span class="text-xs text-padel-teal font-semibold animate-pulse tracking-wide">
          Menginisialisasi Arena 3D...
        </span>
      </div>

      <!-- The canvas mount element -->
      <div ref="canvasContainer" class="w-full h-full"></div>

      <!-- Tooltip Melayang -->
      <div
        v-if="activeTooltip"
        :style="{ left: activeTooltip.x + 'px', top: activeTooltip.y + 'px' }"
        class="absolute pointer-events-none transform -translate-x-1/2 bg-padel-dark/75 border border-padel-teal/30 text-padel-teal text-[10px] font-bold py-1.5 px-3 rounded shadow-md shadow-black/30 z-25 backdrop-blur-md"
      >
        {{ activeTooltip.text }}
      </div>
    </div>

    <!-- 2. TAMPILAN 2D FALLBACK (SVG Hotspots Overlay) -->
    <div v-show="!use3D || !webglSupported" class="relative w-full h-full group">
      <img
        src="/indoor_court.png"
        alt="Showcase Lapangan Padel48"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-padel-dark/80 via-transparent to-transparent"></div>

      <!-- Hotspot Interaktif SVG overlays -->
      <div class="absolute inset-0 z-10 pointer-events-auto">
        <!-- Hotspot Net -->
        <button
          @click="
            selectFeature2D('net', {
              title: 'Net Padel Regulasi WPT',
              desc: 'Net dengan ketegangan baja teruji dan ketinggian presisi 88 cm di bagian tengah, memastikan regulasi turnamen internasional dipatuhi.',
              img: '/hero.png'
            })
          "
          class="absolute top-[48%] left-[25%] w-[50%] h-[8%] border border-padel-teal/0 hover:border-padel-teal/50 bg-padel-teal/0 hover:bg-padel-teal/10 rounded-md transition-all duration-300 flex items-center justify-center group/btn text-[10px] text-padel-teal font-black opacity-0 hover:opacity-100 cursor-pointer"
        >
          [ Klik Info Net ]
        </button>

        <!-- Hotspot Dinding Kaca Belakang -->
        <button
          @click="
            selectFeature2D('glass', {
              title: 'Kaca Tempered Panoramik 12mm',
              desc: 'Dinding kaca tempered panoramik dengan ketahanan impak ekstra tinggi untuk pantulan bola tak terduga yang aman.',
              img: '/outdoor_court.png'
            })
          "
          class="absolute top-[20%] left-[10%] w-[80%] h-[20%] border border-padel-red/0 hover:border-padel-red/50 bg-padel-red/0 hover:bg-padel-red/10 rounded-md transition-all duration-300 flex items-center justify-center text-[10px] text-padel-red font-black opacity-0 hover:opacity-100 cursor-pointer"
        >
          [ Klik Info Kaca Tempered ]
        </button>

        <!-- Hotspot Rumput Turf -->
        <button
          @click="
            selectFeature2D('turf', {
              title: 'Turf Lapangan Biru Premium',
              desc: 'Rumput sintetis monofilamen premium berdensitas tinggi berwarna biru khas World Padel Tour (WPT). Memberikan cengkeraman kaki yang optimal dan pantulan bola konsisten.',
              img: '/indoor_court.png'
            })
          "
          class="absolute top-[60%] left-[20%] w-[60%] h-[25%] border border-padel-gold/0 hover:border-padel-gold/50 bg-padel-gold/0 hover:bg-padel-gold/10 rounded-md transition-all duration-300 flex items-center justify-center text-[10px] text-padel-gold font-black opacity-0 hover:opacity-100 cursor-pointer"
        >
          [ Klik Info Rumput Turf ]
        </button>
      </div>

      <!-- Indikator mode 2D -->
      <div
        class="absolute bottom-4 left-4 text-[9px] bg-padel-dark/70 backdrop-blur-md text-padel-gray px-2 py-0.5 rounded border border-white/5 font-bold uppercase"
      >
        Mode 2D Interaktif (Klik hotspot)
      </div>
    </div>

    <!-- Overlay Text Info Deskripsi Padel -->
    <div
      v-show="!activeTooltip"
      class="absolute bottom-4 left-4 right-4 solid-panel p-3 rounded-xl flex items-center justify-between text-xs z-15 pointer-events-none"
    >
      <span class="text-padel-teal flex items-center gap-1.5 font-semibold">
        <span class="w-2 h-2 rounded-full bg-padel-teal"></span>
        {{ use3D && webglSupported ? 'Model 3D Lapangan (Putar & Klik Objek)' : 'Showcase Lapangan 2D' }}
      </span>
      <span class="text-white font-mono">Premium Arena View</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

.solid-panel {
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.z-25 {
  z-index: 25;
}
</style>
