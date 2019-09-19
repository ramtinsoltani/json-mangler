class Compressor {

  constructor(schema) {

    if ( typeof schema !== 'object' || (schema.constructor !== Object && schema.constructor !== Array) ) {

      this._error = true;

      return;

    }

    this._charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this._cursor = [0];

    // Generate mappings
    this._mappings = {};

    this._generateMappings(schema, null);

  }

  /**
  * Returns a new alias based on the current cursor position. Changes the cursor for next alias.
  */
  _getAlias() {

    let alias = '';

    for ( const cursor of this._cursor ) {

      alias += this._charset[cursor];

    }

    this._cursor[this._cursor.length - 1]++;

    for ( let i = this._cursor.length - 1; i > -1; i-- ) {

      if ( this._cursor[i] < this._charset.length ) continue;

      this._cursor[i] = 0;

      if ( i === 0 ) {

        this._cursor.unshift(0);
        break;

      }
      else {

        this._cursor[i-1]++;

      }

    }

    return alias;

  }

  /**
  * Adds the mapping to this._mappings.
  * @param alias The key alias.
  * @param original The original key.
  */
  _addMapping(alias, original) {

    this._mappings[alias] = original;

  }

  /**
  * Generates mappings based on the given compression schema.
  * @param schema The compression schema.
  */
  _generateMappings(schema, currentPath) {

    for ( const key in schema ) {

      if ( typeof schema[key] === 'object' && (schema[key].constructor === Object || schema[key].constructor === Array) )
        this._generateMappings(schema[key], `${currentPath ? currentPath + '.' : ''}${schema.constructor === Array ? '*' : key}`);

      if ( schema.constructor === Array ) continue;

      let alias = this._getAlias();

      while ( schema[alias] !== undefined ) alias = this._getAlias();

      this._addMapping(alias, `${currentPath ? currentPath + '.' : ''}${key}`);

    }

  }

  /**
  * Compresses a JSON object based on the generated mappings from the schema.
  * @param json The object to compress.
  */
  _compress(json) {

    for ( const alias in this._mappings ) {

      let keys = this._mappings[alias].split('.');
      const target = keys.pop();
      let refs = [json];
      let indexOffset = 0;

      for ( const key of keys ) {

        for ( let i = 0; i < refs.length; i++ ) {

          const ref = refs[i];

          if ( ref === undefined ) continue;

          if ( key === '*' ) {

            for ( const child of ref ) {

              if ( child !== undefined ) {

                refs.unshift(child);
                indexOffset++;

              }

            }

            i+= indexOffset;
            refs.splice(i, 1)
            i--;

            indexOffset = 0;


          }
          else {

            if ( ref !== undefined ) refs[i] = ref[key];

          }

        }

      }

      for ( const ref of refs ) {

        if ( ref !== undefined && ref[target] !== undefined ) {

          ref[alias] = ref[target];
          delete ref[target];

        }

      }

    }

  }

  /**
  * Returns the current mappings.
  */
  get mappings() {

    let string = '';

    for ( const alias in this._mappings ) {

      string += `${alias}:${this._mappings[alias]};`;

    }

    return string;

  }

  /**
  * Compresses a JSON object.
  * @param json The object to compress.
  * @param noClone Will avoid cloning the object (will be faster but mutates the original object by reference, defaults to false).
  * @param calcInfo Will calculate the compression info (will make the compression slower, defaults to false).
  */
  compress(json, noClone, calcInfo) {

    if ( this._error ) {

      return {
        error: true,
        message: 'Invalid schema!'
      };

    }

    if ( typeof json !== 'object' || (json.constructor !== Object && json.constructor !== Array) ) {

      return {
        error: true,
        message: 'Invalid object!'
      };

    }

    let startTime, totalTime;

    if ( calcInfo ) startTime = Date.now();

    if ( ! noClone ) json = JSON.parse(JSON.stringify(json));

    let originalSize, newSize;

    if ( calcInfo ) originalSize = JSON.stringify(json).length;

    this._compress(json);

    if ( calcInfo ) newSize = JSON.stringify(json).length;

    if ( calcInfo ) totalTime = Date.now() - startTime;

    this._cursor = [0];

    return {
      compressed: json,
      mappings: this.mappings,
      info: calcInfo ? {
        originalSize: originalSize,
        newSize: newSize,
        diff: originalSize - newSize,
        time: totalTime
      } : null
    };

  }

}

class Decompressor {

  constructor(mappings) {

    if ( typeof mappings !== 'string' ) {

      this._error = true;

      return;

    }

    this._rawMappings = mappings;
    this._mappings = this._parseMappings(mappings);

  }

  /**
  * Parses mappings string to an array of key-value pair objects sorted by depth.
  * @param mappings A mappings string.
  */
  _parseMappings(mappings) {

    if ( mappings[mappings.length - 1] === ';' ) mappings = mappings.substr(0, mappings.length - 1);

    const parsed = [];

    for ( const mapping of mappings.split(';') ) {

      const segments = mapping.split(':');

      parsed.push({
        alias: segments[0],
        path: segments[1]
      });

    }

    return parsed.sort((a, b) => a.path.split('.').length - b.path.split('.').length );

  }

  /**
  * Decompresses a JSON object based on the provided mappings.
  * @param json The object to decompress.
  */
  _decompress(json) {

    for ( const mapping of this._mappings ) {

      let keys = mapping.path.split('.');
      const target = keys.pop();
      let refs = [json];
      let indexOffset = 0;

      for ( const key of keys ) {

        for ( let i = 0; i < refs.length; i++ ) {

          const ref = refs[i];

          if ( ref === undefined ) continue;

          if ( key === '*' ) {

            for ( const child of ref ) {

              if ( child !== undefined ) {

                refs.unshift(child);
                indexOffset++;

              }

            }

            i+= indexOffset;
            refs.splice(i, 1)
            i--;

            indexOffset = 0;


          }
          else {

            if ( ref !== undefined ) refs[i] = ref[key];

          }

        }

      }

      for ( const ref of refs ) {

        if ( ref !== undefined && ref[mapping.alias] !== undefined ) {

          ref[target] = ref[mapping.alias];
          delete ref[mapping.alias];

        }

      }

    }

  }

  /**
  * Returns the mappings string.
  */
  get mappings() {

    return this._rawMappings;

  }

  /**
  * Decompresses a compressed JSON object.
  * @param json The object to decompress.
  * @param noClone Will avoid cloning the object (will be faster but mutates the original object by reference, defaults to false).
  * @param calcInfo Will calculate the decompression info (will make the decompression slower, defaults to false).
  */
  decompress(json, noClone, calcInfo) {

    if ( this._error ) {

      return {
        error: true,
        message: 'Invalid mappings!'
      };

    }

    if ( typeof json !== 'object' || (json.constructor !== Object && json.constructor !== Array) ) {

      return {
        error: true,
        message: 'Invalid object!'
      };

    }

    let startTime, totalTime;

    if ( calcInfo ) startTime = Date.now();

    if ( ! noClone ) json = JSON.parse(JSON.stringify(json));

    let originalSize, newSize;

    if ( calcInfo ) originalSize = JSON.stringify(json).length;

    this._decompress(json);

    if ( calcInfo ) newSize = JSON.stringify(json).length;

    if ( calcInfo ) totalTime = Date.now() - startTime;

    return {
      decompressed: json,
      info: calcInfo ? {
        originalSize: originalSize,
        newSize: newSize,
        diff: originalSize - newSize,
        time: totalTime
      } : null
    };

  }

}

module.exports = {
  Compressor: Compressor,
  Decompressor: Decompressor
};
