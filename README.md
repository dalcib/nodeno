# [WIP] nodeno
Port of Deno to Node

## Description

This port keeps almost all the javascript code in `deno` untouched.
It replaces the `rust` interface for a `nodejs` interface

The communication between `deno` and `rust` uses the function `Deno.core.send`, wich uses a function dictionary :

```typescript
globalThis.Deno = {
  core: {
    send: (opName: string, args: object, zeroCopy?: any) => {
        return opsCache[opName](...args, zeroCopy)
    }
    /*encode: (text: string) => {
      const encoder = new TextEncoder();
      return encoder.encode(text);
    },
    decode: (bytes: Uint8Array) => {
      const decoder = new TextDecoder();
      return decoder.decode(bytes);
    },
    print: (text: string) => {
      process.stdout.write(text);
    }*/
  }
}

const opsCache = {
  op_chdir: process.chdir,
  op_chmod_sync: fs.chmodSync,
  op_chown_sync: fs.chownSync,
  op_console_size: () => process.stdout.columns,
  op_copy_file_sync: fs.copyFileSync,
  op_cwd: process.cwd,
  op_delete_env: (key: string) => delete process.env[key],
  op_env: () => process.env,
  op_exec_path: (): string => process.execPath,
  op_exit: process.exit,
  op_fdatasync_sync: fs.fdatasyncSync,
  ...
}
```
(simplified code)

## Use

```javascript
//index.js
import ('./denode.js')

console.log(Deno.cwd)

const text = Deno.readTextFileSync('./README.md')

```
