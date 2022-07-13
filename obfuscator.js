const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, ".");
let jsFiles = [];

function detectType(fileName) {
  // console.log(fileName)
  if (fileName != "obfuscator.js") {
    if (fileName.endsWith(".js")) {
      jsFiles.push(fileName);
    }
  }
}
function obfuscateJSFile(fileName, fileContent) {
    let obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 1,
      debugProtection: false,
      debugProtectionInterval: 0,
      disableConsoleOutput: true,
      domainLock: [],
      domainLockRedirectUrl: "about:blank",
      forceTransformStrings: [],
      identifierNamesCache: null,
      identifierNamesGenerator: "hexadecimal",
      identifiersDictionary: [],
      identifiersPrefix: "",
      ignoreImports: false,
      inputFileName: "",
      log: false,
      numbersToExpressions: true,
      optionsPreset: "default",
      renameGlobals: false,
      renameProperties: false,
      renamePropertiesMode: "safe",
      reservedNames: [],
      reservedStrings: [],
      seed: 0,
      selfDefending: false,
      simplify: true,
      sourceMap: false,
      sourceMapBaseUrl: "",
      sourceMapFileName: "",
      sourceMapMode: "separate",
      sourceMapSourcesMode: "sources-content",
      splitStrings: true,
      splitStringsChunkLength: 5,
      stringArray: true,
      stringArrayCallsTransform: false,
      stringArrayCallsTransformThreshold: 0.5,
      stringArrayEncoding: ["rc4"],
      stringArrayIndexesType: ["hexadecimal-number"],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 5,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: "function",
      stringArrayThreshold: 1,
      target: "node",
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
    });
  // console.log(fileName);
  // console.log(fileContent);
  // console.log()/\
  fs.writeFile(
    `${fileName.split(".")[0]}.obfuscated.js`,
    obfuscationResult.getObfuscatedCode(),
    (err) => {
      if (err) throw err;

    }
  );
  // console.log(obfuscationResult.getObfuscatedCode());
}

let readdir = fs.readdirSync(dirPath);
readdir.forEach((file) => {
  detectType(file);
});

for (let x of jsFiles) {
  fileContent = fs.readFileSync(`./${x}`).toString();
  obfuscateJSFile(x, fileContent);
}
