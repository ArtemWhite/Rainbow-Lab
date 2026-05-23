import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function RayTrace3D({ impactParam, n, dropR, color }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth || 400
    const h = 300

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
    camera.position.set(3, 2.5, 4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Lighting
    scene.add(new THREE.AmbientLight(0x404040, 2))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    // Droplet
    const dropGeo = new THREE.SphereGeometry(dropR, 64, 64)
    const dropMat = new THREE.MeshPhysicalMaterial({
      color: 0x88bbff,
      metalness: 0,
      roughness: 0.1,
      transparent: true,
      opacity: 0.18,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.4,
    })
    const droplet = new THREE.Mesh(dropGeo, dropMat)
    scene.add(droplet)

    // Wireframe for droplet outline
    const wireGeo = new THREE.SphereGeometry(dropR * 1.001, 32, 16)
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wire)

    // Compute ray geometry in 3D
    const h3 = impactParam * dropR
    const i = Math.asin(h3 / dropR)
    const r = Math.asin(Math.sin(i) / n)

    // Points in the XZ plane (3D)
    const entryY = h3
    const entryX = -Math.sqrt(dropR * dropR - h3 * h3)
    const entry = new THREE.Vector3(entryX, entryY, 0)

    const backAngle = Math.PI - i + 2 * r
    const backX = dropR * Math.cos(backAngle)
    const backY = dropR * Math.sin(backAngle)
    const back = new THREE.Vector3(backX, backY, 0)

    const exitAngle = Math.PI + i - 4 * r
    const exitX = dropR * Math.cos(exitAngle)
    const exitY = dropR * Math.sin(exitAngle)
    const exit = new THREE.Vector3(exitX, exitY, 0)

    // Ray lines
    const rayGroup = new THREE.Group()

    function makeLine(from, to, c, opacity = 0.9) {
      const geo = new THREE.BufferGeometry().setFromPoints([from, to])
      const mat = new THREE.LineBasicMaterial({ color: c, transparent: true, opacity })
      return new THREE.Line(geo, mat)
    }

    // Incoming ray
    const inStart = new THREE.Vector3(-2.5, entryY, 0)
    rayGroup.add(makeLine(inStart, entry, 0xffffff, 0.6))

    // Refracted ray inside
    const c3 = new THREE.Color(color)
    rayGroup.add(makeLine(entry, back, c3, 0.8))
    rayGroup.add(makeLine(back, exit, c3, 0.8))

    // Outgoing ray
    const outDir = new THREE.Vector3(Math.cos(exitAngle - Math.PI), Math.sin(exitAngle - Math.PI), 0).normalize()
    const outEnd = exit.clone().add(outDir.multiplyScalar(2.5))
    rayGroup.add(makeLine(exit, outEnd, c3, 0.6))

    // Dashed incoming extension
    const dashStart = new THREE.Vector3(-2.5, entryY, 0)
    rayGroup.add(makeLine(dashStart, entry, 0xffffff, 0.3))

    scene.add(rayGroup)

    // Small spheres at key points
    function addDot(pos, c, size = 0.06) {
      const g = new THREE.SphereGeometry(size, 16, 16)
      const m = new THREE.MeshBasicMaterial({ color: c })
      const dot = new THREE.Mesh(g, m)
      dot.position.copy(pos)
      return dot
    }

    scene.add(addDot(entry, 0xffffff, 0.07))
    scene.add(addDot(back, c3, 0.05))
    scene.add(addDot(exit, c3, 0.05))

    // Orbit controls (simple mouse drag)
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }
    let spherical = new THREE.Spherical()
    spherical.setFromVector3(camera.position)
    let theta = spherical.theta
    let phi = spherical.phi
    const radius = 4.5

    function updateCamera() {
      phi = Math.max(0.3, Math.min(Math.PI / 2, phi))
      camera.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta),
      )
      camera.lookAt(0, 0, 0)
    }

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true
      prevMouse = { x: e.clientX, y: e.clientY }
    })
    window.addEventListener('mouseup', () => { isDragging = false })
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      const dx = e.clientX - prevMouse.x
      const dy = e.clientY - prevMouse.y
      theta -= dx * 0.008
      phi -= dy * 0.008
      updateCamera()
      prevMouse = { x: e.clientX, y: e.clientY }
    })
    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault()
    })
    renderer.domElement.style.cursor = 'grab'

    function animate() {
      requestAnimationFrame(animate)
      droplet.rotation.y += 0.001
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = mount.clientWidth || 400
      renderer.setSize(nw, h)
      camera.aspect = nw / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [impactParam, n, dropR, color])

  return (
    <div ref={mountRef} className="w-full bg-canvas-night-soft rounded-xs overflow-hidden" style={{ minHeight: 300 }} />
  )
}
