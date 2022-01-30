const extractAllPhotoNames = (node) => {
  if (node.type === "element" && node.tagName === "photo") {
    if (node.children.length !== 1) {
      console.error(`Node ${node} has more than one children`);
      return [];
    }
    if (node.children[0].type !== "text") {
      console.error(`Node ${node} does not have text children`);
      return [];
    }
    return [node.children[0].value];
  } else if (node.type === "text") {
    return [];
  } else {
    return node.children.flatMap(extractAllPhotoNames);
  }
};

const runExtractAllPhotoNames = (root) =>
  root.children.flatMap(extractAllPhotoNames);

const extractAllPhotoNamesRegex = (mdContent) => {
  const pattern = /<photo>(.*)<\/photo>/g;
  const matchesIter = mdContent.matchAll(pattern);
  const photoNames = [];
  for (const m of matchesIter) {
    photoNames.push(m[1]);
  }
  return photoNames;
};

module.exports = {
  runExtractAllPhotoNames,
  extractAllPhotoNamesRegex,
};
