/* ========================================================================
 * Bootstrap: button.js v3.1.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================
  // button插件类及原型方法的定义
  var Button = function (element, options) { // 传入要触发的元素和调用options选项参数
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)  // 合并参数
    this.isLoading = false // 是否加载状态
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'  // 默认loading时的文本内容
  }

  // 设置按钮状态的方法，所有的自定义参数都使用这个方法
  Button.prototype.setState = function (state) {
    var d    = 'disabled' // 按钮需要禁用时使用它，先赋值一个临时变量
    var $el  = this.$element // 当前元素
    var val  = $el.is('input') ? 'val' : 'html'  // 如果是input，则使用val获取值，否则使用html获取值
    var data = $el.data()  // 获取当前元素的自定义属性，即所有以data-开头的属性

    // 组装下面需要用到的属性，比如传入了loading，则组装成loadingText，在下面就查找
    // data-loading-text属性值
    state = state + 'Text'


    // 如果data里不包含data-reset-text值，则将当前元素的值赋给data-reset-text临时存放，以便过后再恢复使用它
    if (!data.resetText) $el.data('resetText', $el[val]())

    // 给元素赋新值，先从自定义属性里查询(比如data-complete-text)，如果没有，就从options 默认值里查询
    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    // 不阻止事件，以允许表单的提交
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {  // 如果传入的是loading
        this.isLoading = true    // 设置加载状态为true
        $el.addClass(d).attr(d, d)   // 禁用该元素(即添加disabled样式和disabled属性)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)   // 如果不是loading，则删除disabled样式和disabled属性
      }
    }, this), 0)
  }

  // 切换按钮状态
  Button.prototype.toggle = function () {
    var changed = true   // 设置change标记
    var $parent = this.$element.closest('[data-toggle="buttons"]')  // 查找带有[data-toggle="buttons"]属性的最近父元素

    if ($parent.length) {   // 如果父元素存在
      var $input = this.$element.find('input') // 查看触发元素内是否有input
      if ($input.prop('type') == 'radio') {   // 如果查找到的input是radio
        // 判断如果该radio已经是高亮且是被选中的，则不需要再改变(change为false)
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        // 否则，查找同级元素是否有为active的，如果有，删除之
        else $parent.find('.active').removeClass('active')
      }

      // 如果有，继续判断是否活动(有active样式)，否则的话则设置为禁用;不活动，就设置为启用，并触发change事
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    // 在change标记为true时，将自身元素的状态进行反转，即反转active样式
    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {  // 遍历所有符合规则的元素
      var $this   = $(this)
      var data    = $this.data('bs.button')  // 获取自定义属性data-bs.button的值(其实是button实例)
      var options = typeof option == 'object' && option

      // 如果没有button实例，就初始化一个，并传入this
      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      // 如果option是toggle字符，说明传入的是一个方法，直接调用该方法
      // 否则调用setState方法
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  //注意Constructor首字母是大写，和constructor的区别
  $.fn.button.Constructor = Button  // 并重设插件构造器，可以通过该属性获取插件的真实类函数


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============
  // 绑定触发事件
  // 查询所有以button开头为值的data-toggle属性，绑定click事件
  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)  // 当前单击对象
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')   // 如果没有btn样式，就查找最近带有btn样式的元素
    $btn.button('toggle')   // 反转状态
    e.preventDefault() // 组织默认事件
  })
    //建议代码
   // $(document).on('click.bs.button.data-api ', '[data-toggle="button"], [data-toggle="buttons"]', function (e) {
       // 处理逻辑
   // })
}(jQuery);
