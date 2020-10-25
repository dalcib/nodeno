const {PermissionDenied} = Deno.errors;
function getPermissionString(descriptors) {
  return descriptors.length ? `  ${descriptors.map((pd) => {
    switch (pd.name) {
      case "read":
      case "write":
        return pd.path ? `--allow-${pd.name}=${pd.path}` : `--allow-${pd.name}`;
      case "net":
        return pd.url ? `--allow-${pd.name}=${pd.url}` : `--allow-${pd.name}`;
      default:
        return `--allow-${pd.name}`;
    }
  }).join("\n  ")}` : "";
}
export async function grant(descriptor, ...descriptors) {
  const result = [];
  descriptors = Array.isArray(descriptor) ? descriptor : [descriptor, ...descriptors];
  for (const descriptor2 of descriptors) {
    let state = (await Deno.permissions.query(descriptor2)).state;
    if (state === "prompt") {
      state = (await Deno.permissions.request(descriptor2)).state;
    }
    if (state === "granted") {
      result.push(descriptor2);
    }
  }
  return result.length ? result : void 0;
}
export async function grantOrThrow(descriptor, ...descriptors) {
  const denied = [];
  descriptors = Array.isArray(descriptor) ? descriptor : [descriptor, ...descriptors];
  for (const descriptor2 of descriptors) {
    const {state} = await Deno.permissions.request(descriptor2);
    if (state !== "granted") {
      denied.push(descriptor2);
    }
  }
  if (denied.length) {
    throw new PermissionDenied(`The following permissions have not been granted:
${getPermissionString(denied)}`);
  }
}
