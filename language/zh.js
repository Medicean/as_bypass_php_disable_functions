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
  precheck: {
    only_linux: "仅支持Linux操作系统",
    only_win: "仅支持Windows操作系统",
    require_func: (func) => `${func} 函数不可用`,
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
    php_fpm: {
      title: "Fastcgi/PHP-FPM",
      form: {
        fpm_addr: 'FPM/FCGI 地址',
        phpbinary: 'php路径(PHP>=5.3, 并非当前运行的shell php)',
      },
      msg: {
        genext_err: "生成PHP扩展失败",
      }
    },
    apache_mod_cgi: {
      title: "Apache_mod_cgi",
      status_cell: {
        modcgi: "CGI支持",
        writable: "当前目录可写",
        htaccess: "htaccess支持",
      }
    },
    json_serializer_uaf: {
      title: "Json Serializer UAF",
      status_cell: {
        ver: 'PHP版本',
      },
      err: {
        phpvererr: "PHP 版本不符, 仅支持 7.1.x, 7.2.0~7.2.18, 7.3.0~7.3.5"
      }
    },
    php7_gc_uaf: {
      title: "PHP7 GC with Certain Destructors UAF",
      status_cell: {
        ver: 'PHP版本',
      },
      err: {
        phpvererr: "PHP 版本不符, 仅支持 7.0.x, 7.1.x, 7.2.x, 7.3.x"
      }
    },
    php7_backtrace_uaf: {
      title: "PHP7 Backtrace UAF",
      status_cell: {
        ver: 'PHP版本',
      },
      err: {
        phpvererr: "PHP 版本不符, 仅支持 7.0.x, 7.1.x, 7.2.x, 7.3.0~7.3.14, 7.4.0~7.4.2"
      }
    },
    php74_ffi: {
      title: "PHP>=7.4 FFI扩展执行命令",
      status_cell: {
        ver: 'PHP版本',
        ffi: 'FFI扩展',
        ffi_enable: 'FFI Enable',
      },
      err: {
        phpvererr: "PHP 版本不符, 必须 7.4 以上",
        ffi_not_loaded: "未开启FFI扩展",
        ffi_not_enable: "ffi.enabled 未设置为 On, 不能利用.默认为 preload(仅允许在 php-cli 和 preload 中使用)",
      }
    },
  }
}