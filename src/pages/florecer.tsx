import dynamic from 'next/dynamic'
import FlorScene from '@/components/pages/Flor/FlorScene'
import * as meta from '@/config'
import { PerspectiveCamera } from '@react-three/drei'
import * as X from 'next-axiom'
import { Leva } from 'leva'
import { FlorTop, Instructions } from '@/components/dom/Instructions'
import * as hooks from '@/utils/hooks'
import * as R from 'react'
import * as browser from '@/utils/browser'
import { useAudioPlayer, useAudioPosition } from 'react-use-audio-player'
import florecerData from '../music/florecer.json'
import * as T from 'three'
import * as F from '@react-three/fiber'

// const Box = dynamic(() => import('@/components/canvas/Box'), {
//     ssr: false,
// })
let baseUrl = 'https://ph4un00b.github.io/data'
let data = florecerData as MusicAnalysis

function Page(props) {
    const [collapsed, setCollapsed] = R.useState(true)
    X.log.debug('🌸', { sopa: 'init' })

    const { togglePlayPause, ready, loading, playing } = useAudioPlayer({
        src: `${baseUrl}/florecer/source.mus`,
        format: 'mp3',
        autoplay: false,
        onend: () => console.log('sound has ended!'),
    })

    // const { percentComplete, duration, seek, position } = useAudioPosition({
    //     highRefreshRate: true,
    // })

    // R.useLayoutEffect(() => {
    //     console.log({ position })
    // })

    hooks.useTimeout(() => {
        if (browser.isMobile()) X.log.debug('📲', { sopa: 'mobile' })
        if (browser.isMobile()) return
        setCollapsed(!true)

        alert('will play!')
        togglePlayPause()
    }, 2101)

    if (!ready && !loading) return <div>No audio to play</div>
    if (loading) return <div>Loading audio</div>

    return (
        <>
            {/* <FlorTop /> */}
            <Leva
                collapsed={{
                    collapsed,
                    onChange(c) { },
                }}
                hidden={true}
            />
        </>
    )
}

Page.r3f = function (props) {
    return (
        <>
            <color attach='background' args={['#000']} />
            <PerspectiveCamera
                position={[0, 0, 1]}
                fov={75}
                // auto updates the viewport
                manual={false}
                makeDefault={true}
            />

            <FlorScene />
            {/* <axesHelper args={[8]} /> */}
        </>
    )
}

export default Page

export async function getStaticProps() {
    return {
        props: {
            title: `Florecer 🌺 GLSL - ${meta.titleDefault}`,
        },
    }
}

export interface MusicAnalysis {
    meta: Meta
    track: Track
    bars: Bar[]
    beats: Beat[]
    sections: Section[]
    segments: Segment[]
    tatums: Tatum[]
}

export interface Meta {
    analyzer_version: string
    platform: string
    detailed_status: string
    status_code: number
    timestamp: number
    analysis_time: number
    input_process: string
}

export interface Track {
    num_samples: number
    duration: number
    sample_md5: string
    offset_seconds: number
    window_seconds: number
    analysis_sample_rate: number
    analysis_channels: number
    end_of_fade_in: number
    start_of_fade_out: number
    loudness: number
    tempo: number
    tempo_confidence: number
    time_signature: number
    time_signature_confidence: number
    key: number
    key_confidence: number
    mode: number
    mode_confidence: number
    codestring: string
    code_version: number
    echoprintstring: string
    echoprint_version: number
    synchstring: string
    synch_version: number
    rhythmstring: string
    rhythm_version: number
}

export interface Bar {
    start: number
    duration: number
    confidence: number
}

export interface Beat {
    start: number
    duration: number
    confidence: number
}

export interface Section {
    start: number
    duration: number
    confidence: number
    loudness: number
    tempo: number
    tempo_confidence: number
    key: number
    key_confidence: number
    mode: number
    mode_confidence: number
    time_signature: number
    time_signature_confidence: number
}

export interface Segment {
    start: number
    duration: number
    confidence: number
    loudness_start: number
    loudness_max_time: number
    loudness_max: number
    loudness_end: number
    pitches: number[]
    timbre: number[]
}

export interface Tatum {
    start: number
    duration: number
    confidence: number
}
