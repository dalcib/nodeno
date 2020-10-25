export function fromStreamWriter(streamWriter) {
  return {
    async write(p) {
      await streamWriter.ready;
      await streamWriter.write(p);
      return p.length;
    }
  };
}
export function fromStreamReader(streamReader) {
  const buffer = new Deno.Buffer();
  return {
    async read(p) {
      if (buffer.empty()) {
        const res = await streamReader.read();
        if (res.done) {
          return null;
        }
        await Deno.writeAll(buffer, res.value);
      }
      return buffer.read(p);
    }
  };
}
