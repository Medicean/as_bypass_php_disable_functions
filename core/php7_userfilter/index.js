'use strict';

const Base = require('../base');
const LANG = require('../../language'); // 插件语言库
const LANG_T = antSword['language']['toastr']; // 通用通知提示
const nodeurl = require('url');
const {
  PHP7_UserFilter_EXP
} = require('../../payload');
let PHP7_USERFILTER_LANG = LANG['core']['php7_userfilter'];

class PHP7_UserFilter extends Base {
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
    // if (infodata.ver != "7.0" &&
    //   infodata.ver != "7.1" && infodata.ver != "7.2" && infodata.ver != "7.3") {
    //   toastr.error(PHP7_USERFILTER_LANG['err']['phpvererr'], LANG_T['error']);
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
          label: PHP7_USERFILTER_LANG['title']
        }, {
          type: 'block',
          inputWidth: 'auto',
          list: [{
              type: 'settings'
            },
            {
              type: "label",
              label: `<span>${PHP7_USERFILTER_LANG['status_cell']['ver']}</span>`,
            },
            {
              type: "newcolumn"
            },
            {
              type: "label",
              labelWidth: 300,
              label: `7.0 - all versions to date`,
            },
            {
              type: "label",
              labelWidth: 300,
              label: `7.1 - all versions to date`,
            },
            {
              type: "label",
              labelWidth: 300,
              label: `7.2 - all versions to date`,
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
          _: PHP7_UserFilter_EXP(arg['bin'], arg['cmd']),
        }
      }
    });
  }
}

function references(name, value) {
  let refs = {
    "PHP 7.0-8.0 user_filter bypass": "https://github.com/mm0r1/exploits/tree/master/php-filter-bypass",
    "AntSword-Labs/bypass_disable_functions/7": "https://github.com/AntSwordProject/AntSword-Labs/blob/master/bypass_disable_functions/7",
    "Bug #54350	Memory corruption with user_filter": "https://bugs.php.net/bug.php?id=54350",
  };
  let ret = "";
  Object.keys(refs).map((k) => {
    ret += `<li style="padding-bottom: 10px;"><a href='${refs[k]}' target='blank'>${k}</a></li>`;
  })
  return `<div class='simple_link'><ul>${ret}</ul></div>`;
}

module.exports = PHP7_UserFilter;