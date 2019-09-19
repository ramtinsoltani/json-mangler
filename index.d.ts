declare module 'json-compress' {

  /**
  * Compressor class used for compressing JSON objects.
  */
  export class Compressor {

    /**
    * Compressor class used for compressing JSON objects.
    * @param schema A schema for the JSON objects that will be compressed with this compressor instance.
    */
    constructor(schema: Object);

    /**
    * Returns the generated mappings.
    */
    readonly mappings: string;

    /**
    * Compresses a JSON object.
    * @param json The object to compress.
    * @param noClone Will avoid cloning the object (will be faster but mutates the original object by reference, defaults to false).
    * @param calcInfo Will calculate the compression info (will make the compression slower, defaults to false).
    */
    compress(json: Object, noClone?: boolean, calcInfo?: boolean): CompressionResult;

  }

  /**
  * Decompressor class used for decompressing JSON objects.
  */
  export class Decompressor {

    /**
    * Decompressor class used for decompressing JSON objects.
    * @param mappings A mappings string for the JSON objects that will be decompressed with this decompressor instance.
    */
    constructor(mappings: string);

    /**
    * Returns the mappings being used.
    */
    readonly mappings: string;

    /**
    * Decompresses a compressed JSON object.
    * @param json The object to decompress.
    * @param noClone Will avoid cloning the object (will be faster but mutates the original object by reference, defaults to false).
    * @param calcInfo Will calculate the decompression info (will make the decompression slower, defaults to false).
    */
    decompress(json: Object, noClone?: boolean, calcInfo?: boolean): DecompressionResult;

  }

  interface CompressionInfo {

    /** Original size of the JSON object in bytes. */
    originalSize: number;
    /** Size of the compressed JSON object in bytes. */
    newSize: number;
    /** The size difference of the original and the final objects in bytes. */
    diff: number;
    /** The time of the compression in milliseconds. */
    time: number;

  }

  interface DecompressionInfo {

    /** Original size of the compressed JSON object in bytes. */
    originalSize: number;
    /** Size of the decompressed JSON object in bytes. */
    newSize: number;
    /** The size difference of the original and the final objects in bytes. */
    diff: number;
    /** The time of the decompression in milliseconds. */
    time: number;

  }

  interface CompressionResult {

    /** The compressed JSON object. */
    compressed: Object;
    /** The generated mappings used for decompressing the object back to its original form. */
    mappings: string;
    /** The compression information (will be null if calcInfo was false at the time of compression). */
    info?: CompressionInfo;

  }

  interface DecompressionResult {

    /** The decompressed JSON object. */
    decompressed: Object;
    /** The decompression information (will be null if calcInfo was false at the time of decompression). */
    info?: DecompressionInfo;

  }

}
