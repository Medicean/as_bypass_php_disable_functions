module.exports = {
  title: "绕过 disable_functions",
  success: "操作成功",
  error: "操作失败",
  no_mode: "请点击上方按钮,选择模式",
  form_not_comp: "请填写完整",
  toolbar: {
    start: "开始",
    select_mode: "选择模式",
  },
  status_cell: {
    title: "Shell状态",
    ver: "PHP版本",
    arch: "PHP位数",
    os: "操作系统",
    phpself: "当前目录",
    func: "函数支持",
  },
  precheck:{
    only_linux: "仅支持Linux操作系统",
    only_win: "仅支持Windows操作系统",
    require_func: (func)=> `${func} 函数不可用`,
  },
  core: {
    base: {
      proxyscript: {
        success: (url) => `上传代理脚本成功: ${url}`,
        fail: "上传代理脚本失败",
      }
    },
    ld_preload: {
      title: "LD_PRELOAD",
      form: {
        phpbinary: 'php路径(PHP>=5.3, 并非当前运行的shell php)',
      },
      msg: {
        genext_err: "生成PHP扩展失败",
      }
    },
  }
}
