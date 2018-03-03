import * as THREE from 'three';

let _threeChunkReplaceRegExp = /\/\/\s?chunk_replace\s(.+)([\d\D]+)\/\/\s?end_chunk_replace/gm;
let _threeChunkRegExp = /\/\/\s?chunk\(\s?(\w+)\s?\);/g;
// let _glslifyBugFixRegExp = /(_\d+_\d+)(_\d+_\d+)+/g;
// let _glslifyGlobalRegExp = /GLOBAL_VAR_([^_\.\)\;\,\s]+)(_\d+_\d+)?/g;
let _glslifyGlobalRegExp = /GLOBAL_VAR_([^_\.\)\;\,\s]+)(_\d+)?/g;

let chunkReplaceObj;

    function _storeChunkReplaceParse(shader) {
        chunkReplaceObj = {};
        return shader.replace(_threeChunkReplaceRegExp, _storeChunkReplaceFunc);
    }

    function _threeChunkParse(shader) {
        return shader.replace(_threeChunkRegExp, _replaceThreeChunkFunc);
    }

    // function _glslifyBugFixParse(shader) {
    //     return shader.replace(glslifyBugFixRegExp, _returnFirst);
    // }

    function _glslifyGlobalParse(shader) {
        return shader.replace(_glslifyGlobalRegExp, _returnFirst);
    }

    function _storeChunkReplaceFunc(a, b, c) {
        chunkReplaceObj[b.trim()] = c;
        return '';
    }

    function _replaceThreeChunkFunc(a, b) {
        let str = THREE.ShaderChunk[b] + '\n';
        for (var id in chunkReplaceObj) {
            str = str.replace(id, chunkReplaceObj[id]);
        }
        return str;
    }

    function _returnFirst(a, b) {
        return b;
    }

    export default function parse(shader) {
        shader = _storeChunkReplaceParse(shader);
        shader = _threeChunkParse(shader);
        // shader = _glslifyBugFixParse(shader);
        return _glslifyGlobalParse(shader);
    }