module.exports = {
  title: "Bypass disable_functions",
  success: "Success",
  error: "Fail",
  no_mode: "Click on the button above, select the mode",
  form_not_comp: "Please complete the form",
  toolbar: {
    start: "Start",
    select_mode: "SelectMode",
  },
  status_cell: {
    title: "Shell Status",
    ver: "PHP Version",
    arch: "PHP Arch",
    os: "OS",
    phpself: "Current directory",
    func: "Function support",
  },
  precheck:{
    only_linux: "Only supports Linux operating system",
    only_win: "Only supports Windows operating system",
    require_func: (func)=> `${func} function is not available`,
  },
  core: {
    base: {
      proxyscript: {
        success: (url) => `Upload proxy script succeeded: ${url}`,
        fail: "Upload proxy script failed",
      }
    },
    ld_preload: {
      title: "LD_PRELOAD",
      form: {
        phpbinary: 'php-cli Path (PHP>=5.3)',
      },
      msg: {
        genext_err: "Generate PHP extension failed",
      }
    },
    php_fpm: {
      title: "PHP-FPM",
      form: {
        fpm_addr: 'FPM/FCGI Address',
        phpbinary: 'php-cli Path (PHP>=5.3)',
      },
      msg: {
        genext_err: "Generate PHP extension failed",
      }
    },
  }
}
