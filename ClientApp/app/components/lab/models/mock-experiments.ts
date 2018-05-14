import { Experiment } from './experiment.model';

const godraysVideo = require('~/wwwroot/assets/videos/godrays.mp4');
const godraysImage = require('~/wwwroot/assets/imgs/godrays.png')

export const EXPERIMENTS: Experiment[] = [
    {
        id: 0,
        title: ['G','o','d','r','a','y','s'],
        subtitle: 'Volumetric Lighting',
        tags: '[ WebGl / Instanced / PostProcessing / GPGPU ]',
        date: 'Feb 2017',
        video: godraysVideo,
        image: godraysImage,
        route: 'godrays'
    },
    {
        id: 1,
        title: ['G', 'o', 'd', 'r', 'a', 'y', 's'],
        subtitle: 'Volumetric Lighting',
        tags: '[ WebGl / Instanced / PostProcessing / GPGPU ]',
        date: 'Feb 2017',
        video: godraysVideo,
        image: godraysImage,
        route: 'godrays'
    },
    {
        id: 2,
        title: ['G', 'o', 'd', 'r', 'a', 'y', 's'],
        subtitle: 'Volumetric Lighting',
        tags: '[ WebGl / Instanced / PostProcessing / GPGPU ]',
        date: 'Feb 2017',
        video: godraysVideo,
        image: godraysImage,
        route: 'godrays'
    }
];