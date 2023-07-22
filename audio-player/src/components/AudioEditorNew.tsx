import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
// import RecordPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/record.esm.js'
// import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js'; // Assuming the plugin URL is this
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'; // Assuming the plugin URL is this


const AudioEditor = ({ audioFile }: { audioFile: string }) => {
    let index: number = 1;

    return (
        <WaveAudio index={index} audio_name={audioFile} />
    )
}

let audioElements: any[] = [];

function WaveAudio(props: { index: number; audio_name: string }) {
    const waveAudioRef = useRef({} as WaveSurfer);
    const audioContainerRef = useRef({} as HTMLElement);
    useEffect(() => {
        const audioElement = document.querySelector(
            `#waveform_${props["index"]}`
        ) as HTMLElement;
        audioContainerRef.current = audioElement;
        const waveform = WaveSurfer.create({
            container: audioElement,
            waveColor: "#363020",
            progressColor: "#4F759B",
            /** The color of the playpack cursor */
            cursorColor: '#4F759B',
            /** The cursor width */
            cursorWidth: 2,
            /** Play the audio on load */
            autoplay: false,
            /** Pass false to disable clicks on the waveform */
            interact: true,
            /** Render the waveform with bars like this: ▁ ▂ ▇ ▃ ▅ ▂ */
            barWidth: 2,
            /** Minimum pixels per second of audio (i.e. zoom level) */
            minPxPerSec: 1,
        });

        const pathToFile = `./${props["audio_name"]}`;
        waveform.load(pathToFile);
        audioElements.push(waveform);
        waveAudioRef.current = waveform;

        // Add bleep region

        const wsRegions = waveform.registerPlugin(RegionsPlugin.create())


        wsRegions.addRegion({
            start: 0,
            end: 1,
            content: 'Drag me',
            color: 'rgba(234, 255, 218, 0.5)',
            resize: false,
        })

        return () => {
            waveform.destroy();
            audioElements.splice(0, audioElements.length);
        };
    });

    return <>
        <div id={`waveform_${props["index"]}`}></div>
    </>;
}

export default AudioEditor;