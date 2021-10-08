'use strict';

const WIN = require('ui/window'); // 窗口库
const LANG_T = antSword['language']['toastr']; // 通用通知提示
const path = require('path');

const {
  BaseInfo
} = require('./payload');
const LANG = require('./language/'); // 插件语言库

/**
 * 插件类
 */
class Plugin {
  constructor(opt) {
    let self = this;
    self.opt = opt;
    self.core = new antSword['core'][opt['type']](opt);
    self.core_menu = [
      // 新增模式时需要在这里添加
      // id 为文件名
      {
        id: "ld_preload",
        icon: 'file-code-o',
        type: 'button',
        text: "LD_PRELOAD"
      },
      {
        id: "php_fpm",
        icon: 'file-code-o',
        type: 'button',
        text: "Fastcgi/PHP_FPM"
      },
      {
        id: "apache_mod_cgi",
        icon: 'file-code-o',
        type: 'button',
        text: "Apache_mod_cgi"
      },
      {
        id: "json_serializer_uaf",
        icon: 'file-code-o',
        type: 'button',
        text: "JSON_Serializer_UAF"
      },
      {
        id: "php7_gc_uaf",
        icon: 'file-code-o',
        type: 'button',
        text: "PHP7_GC_UAF"
      },
      {
        id: "php7_backtrace_uaf",
        icon: 'file-code-o',
        type: 'button',
        text: "PHP7_Backtrace_UAF"
      },
      {
        id: "php74_ffi",
        icon: 'file-code-o',
        type: 'button',
        text: "PHP74_FFI"
      },
      {
        id: "iconv",
        icon: 'file-code-o',
        type: 'button',
        text: "iconv"
      },
      {
        id: "php7_reflectionproperty_uaf",
        icon: 'file-code-o',
        type: 'button',
        text: "PHP7_ReflectionProperty_UAF"
      },
      {
        id: "php7_userfilter",
        icon: 'file-code-o',
        type: 'button',
        text: "PHP7_UserFilter"
      }
    ];
    let cores = {};
    self.core_menu.map((_) => {
      cores[_.id] = require(`./core/${_.id}/index`);
    });
    self.cores = cores;
    self.infodata = {
      os: "",
      arch: "",
      ver: "",
      shell_name: "", // shell 文件名
      phpself: "",
      temp_dir: "",
      open_basedir: [],
      funcs: [],
    };
    // 创建一个 window
    self.status_check = null;
    let win = new WIN({
      title: `${LANG['title']}-${opt['ip']}`,
      height: 500,
      width: 650,
    });
    self.win = win;
    self.createToolbar();
    self.layout = win.win.attachLayout('2U');
    self.config_cell = self.createConfigCell(self.layout.cells('a'));
    self.status_cell = self.createStatusCell(self.layout.cells('b'));
    self.core_instance = null;
    self.reloadStatusCell();

    self.toolbar.attachEvent('onClick', (id) => {
      switch (id) {
        case 'start':
          self.toolbar.disableItem('start');
          try {
            self.core_instance.exploit();
          } catch (e) {
            toastr.error(JSON.stringify(e), LANG_T['error']);
          }
          break;
        default:
          if (self.cores.hasOwnProperty(id)) {
            self.core_instance = new self.cores[id](self.config_cell.cell, self);
            self.toolbar.enableItem('start');
          }
          break;
      }
    });
    // ######### 上方是具体插件代码,由插件作者编写 ##########
  }

  reloadStatusCell() {
    let self = this;
    self.core.request({
      _: BaseInfo()
    }).then((_ret) => { // 处理返回数据
      let res = _ret['text'];
      if (res.indexOf("ERROR://") > -1) {
        throw res;
      } else if (res != "") {
        res = antSword.unxss(res, false);
        self.infodata = Object.assign(self.infodata, JSON.parse(res));
        self.status_cell = self.createStatusCell(self.layout.cells('b'));
      }
    }).catch((err) => { // 处理异常数据
      toastr.error(`${LANG['error']}: ${JSON.stringify(err)}`, LANG_T['error']);
    });
  }

  createStatusCell(cell) {
    let self = this;
    cell.setWidth(220);
    cell.fixSize(1, 0);
    cell.setText(`<i class="fa fa-info"></i> ${LANG['status_cell']['title']}`);
    let form = cell.attachForm([{
        type: 'settings',
        position: 'label-left',
        labelWidth: 80,
      }, {
        type: 'block',
        inputWidth: 'auto',
        list: [{
            type: 'settings',
            blockOffset: 0,
            labelAlign: "left"
          },
          {
            type: "label",
            label: `<span>${LANG['status_cell']['ver']}</span>`
          },
          {
            type: "label",
            label: `<span>${LANG['status_cell']['arch']}</span>`
          },
          {
            type: "label",
            label: `<span>${LANG['status_cell']['os']}</span>`
          },
          {
            type: "label",
            label: `<span>${LANG['status_cell']['phpself']}</span>`
          },
          {
            type: "label",
            label: `<span>${LANG['status_cell']['shell_dir']}</span>`
          },
          {
            type: "newcolumn"
          },
          {
            type: "label",
            name: "ver",
            label: `<span style='color: #000000;'>${antSword.noxss(self.infodata["ver"])}</span>`
          },
          {
            type: "label",
            name: "arch",
            label: `<span style='color: #000000;'>${antSword.noxss(self.infodata["arch"])}</span>`
          },
          {
            type: "label",
            name: "os",
            label: `<span style='color: #000000;'>${antSword.noxss(self.infodata["os"])}</span>`
          },
          {
            type: "label",
            name: "phpself",
            label: `<span style='color: #000000;'>${antSword.noxss(self.infodata["phpself"])}</span>`
          },
          {
            type: "label",
            name: "shell_dir",
            label: `<span style='color: #000000;'>${antSword.noxss(self.infodata["shell_dir"])}</span>`
          },
        ]
      },
      {
        type: 'fieldset',
        blockOffset: 0,
        label: "open_basedir",
        width: "auto",
        name: "open_basedir",
        list: (() => {
          let ret = [];
          Object.keys(self.infodata.open_basedir).map((v) => {
            if (self.infodata.open_basedir[v] == 1) {
              ret.push({
                type: "label",
                label: `<span style='color: green;'>${antSword.noxss(v)}</span>`
              });
            } else {
              ret.push({
                type: "label",
                label: `<span style='color: red;'>${antSword.noxss(v)}</span>`
              });
            }
          });
          return ret;
        })()
      },
      {
        type: 'fieldset',
        blockOffset: 0,
        label: LANG['status_cell']['func'],
        width: "auto",
        name: "funcs",
        list: (() => {
          let ret = [];
          Object.keys(self.infodata.funcs).map((v) => {
            let status = "";
            if (self.infodata.funcs[v] == 1) {
              status = "<span style='color: green;'>√</span>";
            } else {
              status = "<span style='color: red;'>x</span>";
            }
            ret.push({
              type: "label",
              labelWidth: 150,
              label: `${antSword.noxss(v)} ${status}`
            });
          });
          return ret;
        })()
      }
    ], true);
    return {
      cell: cell,
      form: form,
    }
  }

  createToolbar() {
    let self = this;
    let toolbar = self.win.win.attachToolbar();
    toolbar.loadStruct([{
      id: 'new',
      type: 'buttonSelect',
      icon: 'plus-circle',
      openAll: true,
      text: LANG['toolbar']['select_mode'],
      options: self.core_menu,
    }, {
      id: 'start',
      type: 'button',
      text: LANG['toolbar']['start'],
      icon: 'play',
      enabled: false,
    }, ]);
    self.toolbar = toolbar;
  }
  createConfigCell(cell) {
    let self = this;
    cell.hideHeader();
    cell.attachHTMLString(`
    <div align="center" class="about">
      <p style="color: #795548;margin: 30% auto;">${LANG['no_mode']}</p>
    </div>
    `);
    return {
      cell: cell,
      toolbar: toolbar,
    }
  }
}

module.exports = Plugin;