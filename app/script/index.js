#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const VueEngine = require("./engines/vue");
// const PugEngine = require("./engines/pug");
// const JadeEngine = require("./engines/pug");

const args = process.argv;
const fileName = args[args.length - 1];
const filePath = fileName;
let engine;

console.log(fileName, filePath, '<----------');

const _throwAndExit = msg => {
  console.log(chalk.red(msg));
  process.exit(1);
};

const isFile = stats => stats.isFile();
const isDir = stats => stats.isDirectory();

if (!fs.existsSync(filePath)) _throwAndExit(`${fileName} was not found`);

const fileTransform = filePath => {
  const stat = fs.statSync(filePath);
  if (isFile(stat)) {
    if (!filePath.endsWith(".vue")) return;
    engine = VueEngine(filePath);
    if (engine.name === "vue" && !engine.hasSupportedVueTemplate()) return;
    const compiledResult = engine.convertTemplate();
    engine.saveToFile(compiledResult);
    return;
  }
  //根据文件路径读取文件，返回文件列表
  const dirList = fs.readdirSync(filePath);
  //遍历读取到的文件列表
  dirList.forEach(filename => {
    //获取当前文件的绝对路径
    const filedir = path.join(filePath, filename);
    //根据文件路径获取文件信息，返回一个fs.Stats对象
    const stats = fs.statSync(filedir);
    if (stats.isFile()) {
      if (!filedir.endsWith(".vue")) return;
      engine = VueEngine(filedir);
      if (engine.name === "vue" && !engine.hasSupportedVueTemplate()) return;
      const compiledResult = engine.convertTemplate();
      engine.saveToFile(compiledResult);
    }
    if (stats.isDirectory()) {
      fileTransform(filedir);
    }
  });
};

fileTransform(filePath);

// if (filePath.includes(".vue")) engine = VueEngine(filePath);
// else if (filePath.includes(".pug")) engine = PugEngine(filePath);
// else if (filePath.includes(".jade")) engine = JadeEngine(filePath);
// else _throwAndExit(`${fileName} was not found`);
console.log(`${engine.name}----${engine.hasSupportedVueTemplate()}`, '<-----///');
if (engine.name === "vue" && !engine.hasSupportedVueTemplate()) return;
_throwAndExit(`${fileName} does not have a pug template`);
const compiledResult = engine.convertTemplate();
engine.saveToFile(compiledResult);
process.exit(0);
