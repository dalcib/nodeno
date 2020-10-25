import {State} from "../state.mjs";
export class LoaderState extends State {
  constructor(input, {
    filename,
    schema,
    onWarning,
    legacy = false,
    json = false,
    listener = null
  }) {
    super(schema);
    this.input = input;
    this.documents = [];
    this.lineIndent = 0;
    this.lineStart = 0;
    this.position = 0;
    this.line = 0;
    this.result = "";
    this.filename = filename;
    this.onWarning = onWarning;
    this.legacy = legacy;
    this.json = json;
    this.listener = listener;
    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap = this.schema.compiledTypeMap;
    this.length = input.length;
  }
}
