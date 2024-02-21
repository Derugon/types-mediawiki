// Paste this into the browser console
// and copy the console log output

const data = await new mw.Api().get({
    action: "paraminfo",
    format: "json",
    modules: "*",
    formatversion: "2",
});

const queryApiData = await new mw.Api().get({
    action: "paraminfo",
    format: "json",
    modules: "query+*",
    formatversion: "2",
});

function processParamInfo(type, prefix, name, multi) {
    if (Array.isArray(type)) {
        type = type.map((e) => `"${e}"`).join(" | ");
        if (multi) {
            // can be single item or array of items
            type = `OneOrMore<${type}>`;
        }
    } else {
        // API uses type=text for long string fields
        if (type === "text" || type === "title" || type === "user" || type === "raw") {
            type = "string";
        } else if (type === "integer") {
            type = "number";
        }
        if (multi) {
            type = `${type} | ${type}[]`;
        }
    }

    // Avoid being over-specific
    if (
        name === "tags" ||
        name === "tagfilter" || // edit tags, used in core
        name === "wikis" || // used by Extension:Echo APIs
        name === "site" // gusite used by ApiQueryGlobalUsage
    ) {
        type = "string | string[]";
    }

    name = prefix + name;
    if (name.includes("-")) {
        name = `"${name}"`;
    }
    return { name, type };
}

function indent(l) {
    return `\t${l}`;
}

function getInterfaceName(module) {
    return module.classname.split("\\").pop().replace(/Api/g, "") + "Params";
}

function formatInterface(module) {
    const name = getInterfaceName(module);

    return [
        `interface ${name} extends Params {`,
        ...module.parameters.map((param) => {
            const { name, type } = processParamInfo(
                param.type,
                module.prefix,
                param.name,
                param.multi
            );
            return `\t${name}?: ${type};`;
        }),
        "}",
    ]
        .map(indent)
        .join("\n");
}

const actionsTypes = data.paraminfo.modules.map(formatInterface).join("\n\n");
const queryTypes = queryApiData.paraminfo.modules.map(formatInterface).join("\n\n");

console.log(["declare namespace mw.Api {", actionsTypes, "", queryTypes, "}"].join("\n"));
