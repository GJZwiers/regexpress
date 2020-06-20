"use strict";
import fs from 'fs';
import FileHound from 'filehound';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/*
  This script adds .js extensions to ES6 module imports and re-exports, because they are required
  for JavaScript ES6 imports to work but not for TypeScript modules and they are not normally added
  during compilation.

  import {...} from 'path/to/module'
  import * from 'path/to/module'
  export {...} from 'path/to/module'
  export * from 'path/to/module'
  --> 'path/to/module.js'
*/

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = FileHound.create()
  .paths(__dirname + '/dist')
  .discard('node_modules')
  .ext('js')
  .find();

files.then((filePaths) => {
  filePaths.forEach((filepath) => {
    fs.readFile(filepath, 'utf8', (err, data) => {

      if (!/(?:import|export) .* from/.test(data))
        return;
                                 // ((?:import|export) .*? from\s+['"])(.*?)(?=['"])/g
      let newData = data.replace(/((?:import|export) ?.*? ?from\s*['"])(.*?)(?=['"])/g, '$1$2.js');
      if (err) throw err;

      console.log(`writing to ${filepath}`);
      fs.writeFile(filepath, newData, (err) => {
        if (err) throw err;

        console.log('complete');
      });
    });

  });
});
