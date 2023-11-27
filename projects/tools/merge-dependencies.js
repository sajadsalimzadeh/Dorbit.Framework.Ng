const fs = require('fs');
const path = require('path');
const process = require('process');
const os = require('os');
const cp = require('child_process');

const excludes = ['node_modules'];

function findAllFiles(dirPath, pattern) {
  let result = [];
  const files = fs.readdirSync(dirPath);
  files.forEach(filename => {
    const filePath = path.join(dirPath, filename);
    const state = fs.lstatSync(filePath);
    if (state.isDirectory()) {
      if (!excludes.includes(filename)) {
        result = result.concat(findAllFiles(filePath, pattern));
      }
    } else {
      if (pattern.test(filename)) {
        result.push(filePath);
      }
    }
  });
  return result;
}

const rootPath = process.cwd();
const srcPath = path.join(rootPath, 'src');
const packageJsons = findAllFiles(srcPath, /^package.json/);
const rootPackageJson = JSON.parse(fs.readFileSync(path.join(rootPath, 'package.json'), 'utf-8'));

packageJsons.forEach(filePath => {
  const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (let dependenciesKey in packageJson.dependencies) {
    if(!rootPackageJson.dependencies[dependenciesKey]) {
      rootPackageJson.dependencies[dependenciesKey] = packageJson.dependencies[dependenciesKey];
    }
  }
});

fs.writeFileSync(path.join(rootPath, 'package.json'), JSON.stringify(rootPackageJson, null, 2), 'utf-8');
