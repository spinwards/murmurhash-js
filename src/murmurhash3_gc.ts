function stringToArrayBuffer(str: string) {
  const stringLength = str.length;
  const buffer = new ArrayBuffer(stringLength * 2);
  const bufferView = new Uint16Array(buffer);
  for (let i = 0; i < stringLength; i++) {
    bufferView[i] = str.charCodeAt(i);
  }
  return buffer;
}

function toArrayBuffer(key: string | ArrayBuffer | Uint8Array): ArrayBuffer {
  return (key instanceof ArrayBuffer) ? key
    : (typeof key === "string")
      ? stringToArrayBuffer(key)
      : key.buffer;
}

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {Uint8Array} key
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */
export function murmurhash3_32_gc(key: ArrayBuffer | Uint8Array | string, seed: number): number {
  let h1: number;
  let h1b: number;
  let k1: number;
  let i: number;

  const view = new DataView(toArrayBuffer(key));
  const remainder = view.byteLength & 3; // key.length % 4
  const bytes = view.byteLength - remainder;
  h1 = seed || 0x01234567;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {

    k1 = view.getUint32(i, true);
    i += 4;

    k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
    h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
  }

  k1 = 0;

  switch (remainder) {
    case 3: k1 ^= view.getUint8(i + 2) << 16;
    case 2: k1 ^= view.getUint8(i + 1) << 8;
    case 1: k1 ^= view.getUint8(i);

      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= view.byteLength;

  h1 ^= h1 >>> 16;
  h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}


