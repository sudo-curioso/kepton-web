'use client'

import { useRef, useEffect, useState } from 'react'
import { Renderer, Program, Triangle, Mesh } from 'ogl'

const DEFAULT_COLOR = '#ffffff'

type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left'

export interface LightRaysProps {
  raysOrigin?: RaysOrigin
  raysColor?: string
  raysSpeed?: number
  lightSpread?: number
  rayLength?: number
  pulsating?: boolean
  fadeDistance?: number
  saturation?: number
  intensity?: number
  followMouse?: boolean
  mouseInfluence?: number
  noiseAmount?: number
  distortion?: number
  className?: string
}

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1]
}

const getAnchorAndDir = (origin: RaysOrigin, w: number, h: number) => {
  const outside = 0.2
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] }
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] }
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] }
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] }
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] }
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] }
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] }
    default:
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] }
  }
}

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  intensity = 0.38,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = '',
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniformsRef = useRef<Record<string, { value: unknown }> | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 })
  const animationIdRef = useRef<number | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const cleanupFunctionRef = useRef<(() => void) | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    observerRef.current = new IntersectionObserver(
      entries => setIsVisible(entries[0].isIntersecting),
      { threshold: 0, rootMargin: '50px' }
    )
    observerRef.current.observe(containerRef.current)

    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isVisible || !containerRef.current) return

    cleanupFunctionRef.current?.()
    cleanupFunctionRef.current = null

    const initializeWebGL = async () => {
      if (!containerRef.current) return
      await new Promise(resolve => setTimeout(resolve, 10))
      if (!containerRef.current) return

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      })
      rendererRef.current = renderer

      const gl = renderer.gl
      gl.canvas.style.width = '100%'
      gl.canvas.style.height = '100%'

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
      containerRef.current.appendChild(gl.canvas)

      const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

      const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform float intensity;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float distance = length(sourceToCoord);
  vec2 dirNorm = sourceToCoord / max(distance, 0.0001);
  float cosAngle = dot(dirNorm, rayRefDirection);
  float distortedAngle = cosAngle + distortion * sin(iTime * 1.4 + distance * 0.008) * 0.12;
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  spreadFactor = smoothstep(0.0, 1.0, spreadFactor);
  float maxDistance = iResolution.y * rayLength;
  float lengthFalloff = smoothstep(maxDistance, maxDistance * 0.08, distance);
  float fadeFalloff = smoothstep(iResolution.y * fadeDistance, iResolution.y * fadeDistance * 0.25, distance);
  float pulse = pulsating > 0.5 ? (0.92 + 0.08 * sin(iTime * speed * 2.2)) : 1.0;
  float shimmer = 0.88 + 0.12 * sin(distortedAngle * seedA + iTime * speed * 0.9);
  float shimmer2 = 0.9 + 0.1 * cos(-distortedAngle * seedB + iTime * speed * 0.7);
  float baseStrength = shimmer * shimmer2;
  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 uv = coord / iResolution.xy;

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  float rays1 = rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.1 * raysSpeed);
  float rays2 = rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 0.85 * raysSpeed);
  float rays3 = rayStrength(rayPos, finalRayDir, coord, 14.5621, 31.0482, 0.55 * raysSpeed);
  fragColor = vec4(vec3(rays1 * 0.38 + rays2 * 0.32 + rays3 * 0.18), 1.0);

  if (noiseAmount > 0.0) {
    float grain = noise(uv * iResolution.xy * 0.45 + iTime * 0.04);
    fragColor.rgb *= 1.0 - noiseAmount * 0.35 + noiseAmount * 0.35 * grain;
  }

  float verticalLift = smoothstep(0.0, 0.72, 1.0 - uv.y);
  fragColor.rgb *= 0.22 + verticalLift * 0.78;

  vec2 vigCenter = vec2(0.5, 0.38);
  float vignette = 1.0 - smoothstep(0.42, 1.05, length((uv - vigCenter) * vec2(1.05, 1.0)));
  fragColor.rgb *= mix(0.35, 1.0, vignette);

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
  fragColor.rgb = 1.0 - exp(-fragColor.rgb * intensity * 3.2);
  fragColor.rgb = pow(fragColor.rgb, vec3(1.08));
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`

      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        intensity: { value: intensity },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion },
      }
      uniformsRef.current = uniforms

      const geometry = new Triangle(gl)
      const program = new Program(gl, { vertex: vert, fragment: frag, uniforms })
      const mesh = new Mesh(gl, { geometry, program })
      meshRef.current = mesh

      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return
        renderer.dpr = Math.min(window.devicePixelRatio, 2)
        const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current
        renderer.setSize(wCSS, hCSS)
        const dpr = renderer.dpr
        const w = wCSS * dpr
        const h = hCSS * dpr
        uniforms.iResolution.value = [w, h]
        const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h)
        uniforms.rayPos.value = anchor
        uniforms.rayDir.value = dir
      }

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) return
        uniforms.iTime.value = t * 0.001
        if (followMouse && mouseInfluence > 0.0) {
          const smoothing = 0.96
          smoothMouseRef.current.x =
            smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing)
          smoothMouseRef.current.y =
            smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing)
          uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y]
        }
        try {
          renderer.render({ scene: mesh })
          animationIdRef.current = requestAnimationFrame(loop)
        } catch (error) {
          console.warn('WebGL rendering error:', error)
          return
        }
      }

      const resizeObserver = new ResizeObserver(() => updatePlacement())
      resizeObserver.observe(containerRef.current)

      window.addEventListener('resize', updatePlacement)
      updatePlacement()
      animationIdRef.current = requestAnimationFrame(loop)

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
          animationIdRef.current = null
        }
        window.removeEventListener('resize', updatePlacement)
        resizeObserver.disconnect()
        if (renderer) {
          try {
            const canvas = renderer.gl.canvas
            const loseContextExt = renderer.gl.getExtension('WEBGL_lose_context')
            if (loseContextExt) loseContextExt.loseContext()
            if (canvas?.parentNode) canvas.parentNode.removeChild(canvas)
          } catch (error) {
            console.warn('Error during WebGL cleanup:', error)
          }
        }
        rendererRef.current = null
        uniformsRef.current = null
        meshRef.current = null
      }
    }

    initializeWebGL()
    return () => {
      cleanupFunctionRef.current?.()
      cleanupFunctionRef.current = null
    }
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    intensity,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ])

  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current) return
    const u = uniformsRef.current
    const renderer = rendererRef.current
    u.raysColor.value = hexToRgb(raysColor)
    u.raysSpeed.value = raysSpeed
    u.lightSpread.value = lightSpread
    u.rayLength.value = rayLength
    u.pulsating.value = pulsating ? 1.0 : 0.0
    u.fadeDistance.value = fadeDistance
    u.saturation.value = saturation
    u.intensity.value = intensity
    u.mouseInfluence.value = mouseInfluence
    u.noiseAmount.value = noiseAmount
    u.distortion.value = distortion
    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current
    const dpr = renderer.dpr
    const { anchor, dir } = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr)
    u.rayPos.value = anchor
    u.rayDir.value = dir
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    intensity,
    mouseInfluence,
    noiseAmount,
    distortion,
  ])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !rendererRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [followMouse])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className}`.trim()}
    />
  )
}
