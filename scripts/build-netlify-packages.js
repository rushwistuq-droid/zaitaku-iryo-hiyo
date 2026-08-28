#!/usr/bin/env node
/**
 * Netlify Drop 用パッケージを生成する。
 * - netlify-drop/ … 有料note向け（アクセスコードゲートあり）
 * - netlify-drop-internal/ … 院内用（ゲートなし）
 * - netlify-packages/*.zip … 上記を zip 化（ダウンロード用）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SHARED_FILES = ['app.js', 'styles.css', 'icon.svg', 'manifest.webmanifest'];
const GATE_START = '    <!-- アクセスコード入力ゲート';
const APP_CONTAINER = '    <div class="app-container">';

function readIndexHtml() {
    return fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
}

function stripAccessGate(html) {
    const start = html.indexOf(GATE_START);
    const appStart = html.indexOf(APP_CONTAINER);
    if (start === -1 || appStart === -1 || appStart <= start) {
        throw new Error('index.html からアクセスコードゲートを除去できませんでした');
    }
    return html.slice(0, start) + html.slice(appStart);
}

function writePackage(dirName, indexHtml) {
    const outDir = path.join(ROOT, dirName);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml);
    for (const file of SHARED_FILES) {
        fs.copyFileSync(path.join(ROOT, file), path.join(outDir, file));
    }
    return outDir;
}

function zipDir(sourceDir, zipPath) {
    fs.mkdirSync(path.dirname(zipPath), { recursive: true });
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    execSync(`zip -r "${zipPath}" .`, { cwd: sourceDir, stdio: 'inherit' });
}

const indexHtml = readIndexHtml();
const noteDir = writePackage('netlify-drop', indexHtml);
const internalDir = writePackage('netlify-drop-internal', stripAccessGate(indexHtml));

const packagesDir = path.join(ROOT, 'netlify-packages');
const noteZip = path.join(packagesDir, 'zaitaku-hiyo-note-netlify-drop.zip');
const internalZip = path.join(packagesDir, 'zaitaku-hiyo-innai-netlify-drop.zip');

zipDir(noteDir, noteZip);
zipDir(internalDir, internalZip);

console.log('Generated:');
console.log('  ', noteDir);
console.log('  ', internalDir);
console.log('  ', noteZip);
console.log('  ', internalZip);
