import {grant, grantOrThrow} from "./mod.js";
import {assert, assertEquals} from "../testing/asserts.js";
Deno.test({
  name: "grant basic",
  async fn() {
    assertEquals(await grant({name: "net"}, {name: "env"}), [
      {name: "net"},
      {name: "env"}
    ]);
  }
});
Deno.test({
  name: "grant array",
  async fn() {
    assertEquals(await grant([{name: "net"}, {name: "env"}]), [
      {name: "net"},
      {name: "env"}
    ]);
  }
});
Deno.test({
  name: "grant logic",
  async fn() {
    assert(await grant({name: "net"}));
  }
});
Deno.test({
  name: "grantOrThrow basic",
  async fn() {
    await grantOrThrow({name: "net"}, {name: "env"});
  }
});
Deno.test({
  name: "grantOrThrow array",
  async fn() {
    await grantOrThrow([{name: "net"}, {name: "env"}]);
  }
});
