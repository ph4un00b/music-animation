import dynamic from 'next/dynamic'
import * as T from 'three'
import * as D from '@react-three/drei'
import * as F from '@react-three/fiber'
import * as R from 'react'
// Step 5 - delete Instructions components
import Instructions from '@/components/dom/Instructions'
// import Shader from '@/components/canvas/Shader/Shader'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49

/**
 * Hey guys! The fact the error is not getting handle is because the starter is using dynamic component imports which is very nice for a fast render of the DOM but can have some issues such as this one.

I can only recommend importing statically to prevent this:
import Box from '@/components/canvas/Box'

I think it should be better to let the developer choose and go back to static import. That's not very the best performance-wise as it will add a big payload with all the r3f / threejs stack.

What do you guys think?
 */

const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
  ssr: false,
})

// dom components goes here
const Page = (props) => {
  return (
    <>
      <Instructions />
    </>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = (props) => (
  <>
    <Shader />
    <Fondo />
  </>
)

function Fondo() {
  const shader = R.useRef<ShaderProps>(null)

  F.useFrame((state) => {
    shader.current.utime = state.clock.elapsedTime
  })

  return (
    <mesh>
      <planeBufferGeometry args={[10, 10, 2 ** 7, 2 ** 7]} />
      <aguaMat
        ref={shader}
        wireframe={true}
        color={0xff0000}
        side={T.DoubleSide}
      />
    </mesh>
  )
}

type ShaderProps = T.ShaderMaterial & {
  [key: string]: any
}

/** identity for template-literal */
const glsl = (x: TemplateStringsArray) => String(x)

const vertex = glsl`
/** @link https://learnopengl.com/Getting-started/Coordinate-Systems */

// uniform mat4 /** transform coords */ projectionMatrix; 
// uniform mat4 /** transform camera */ viewMatrix;
// uniform mat4 /** transform mesh */ modelMatrix;
/** or use a shorcut */
// uniform mat4 modelViewMatrix;
// attribute vec3 position;
// attribute vec2 uv;

/** all the above are automatically set on <ShaderMaterial/> */

/** context -> inputs */
uniform float utime;


/** outputs -> frag */

varying vec2 vUv;  
varying float vElevation;  

void main()
{
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  /** OR */

  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  /** OR */
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * 4.0 + utime) * 0.5;
  elevation += sin(modelPosition.y * 4.0 + utime) * 0.2;
  modelPosition.z = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  /* outputs */
  vUv = uv;
  vElevation = elevation;
}

/**
 *    - functions are typed as well
 *    - float sum(float a, float b) { return a + b; };
 *
 *    - classic built-in functions
 *      - sin, cos, max, min, pow, exp, mod, clamp
 *
 *    - practical built-in functions
 *      - cross, dot, mix, step, smoothstep, length, distance, reflect, refract, normalize
 *
 * - Documentation: (not beginner-friendly)
 *   - https://www.shaderific.com/glsl-functions
 *   - https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php
 *   - https://thebookofshaders.com/glossary/
 * 
 * - Inspirational Links:
 *   - https://thebookofshaders.com/
 *   - https://www.shadertoy.com/
 *   - https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg
 *   - https://www.youtube.com/channel/UC8Wzk_R1GoPkPqLo-obU_kQ
 */
`

const frag = glsl`
  /** context -> inputs */
  uniform float utime;

  /** vertex -> inputs */
  varying vec2 vUv;
  // #pragma glslify: random = require(glsl-random)
  varying float vElevation;


  void main() {
    // gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + utime) + color, 1.0);
    gl_FragColor.rgba = 1.0 * vElevation * vec4(0.5 + 0.3 * sin(vUv.yxy + utime), 1.0);
    // gl_FragColor.rgba = 1.0 * vElevation * vec4(0.5 + 0.3 * 1.0, 0.5 + 0.3 * 1.0, 0.5 + 0.3 * 1.0, 1.0);
    // gl_FragColor.rgba = vec4(vec3(0.), 1.);
  }
`

let AguaMat = D.shaderMaterial({ utime: 0 }, vertex, frag)
F.extend({ AguaMat }) // -> now you can do <aguaMat ... />
declare module '@react-three/fiber' {
  interface ThreeElements {
    /** @ts-ignore */
    aguaMat: F.MaterialNode<AguaMat, typeof AguaMat>
  }
}

export default Page

/** not ssr needed */
// export async function getStaticProps() {
//   return {
//     props: {
//       title: 'Index',
//     },
//   }
// }
