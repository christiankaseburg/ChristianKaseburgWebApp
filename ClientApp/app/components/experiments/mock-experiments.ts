﻿import { Experiment } from './shared/models/experiment.model';

const godraysVideo = require('../../assets/videos/godrays.mp4');
const godraysImage = require('../../assets/imgs/godraysIMG.png')

export const EXPERIMENTS: Experiment[] = [
    {
        id: 0,
        title: 'Godrays',
        subtitle: 'Volumetric Lighting',
        details: '[ WebGl / Instanced / PostProcessing / GPGPU ]',
        date: 'Feb 2017',
        video: godraysVideo,
        image: godraysImage,
        route: 'godrays'
    },
    {
        id: 1,
        title: 'Godrays',
        subtitle: 'Volumetric Lighting',
        details: '[ WebGl / Instanced / PostProcessing / GPGPU ]',
        date: 'Feb 2017',
        video: godraysVideo,
        image: godraysImage,
        route: 'godrays'
    },
    {
        id: 2,
        title: 'Godrays',
        subtitle: 'Volumetric Lighting',
        details: '[ WebGl / Instanced / PostProcessing / GPGPU ]',
        date: 'Feb 2017',
        video: godraysVideo,
        image: godraysImage,
        route: 'godrays'
    }
];