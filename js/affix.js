/* ========================================================================
 * Bootstrap: affix.js v3.1.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

    // ����Affix��
  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)  // �ϲ�������options���ȼ�����Ĭ��ֵ
    this.$window = $(window)      // ��������window�ϼ��scroll��click�¼�
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))   // scroll�¼�����ʱ������checkPosition����
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))   // click�¼�����ʱ������checkPositionWithEventLoop����
    this.$element     = $(element)    // Ҫ�̶�ճס��Ԫ��
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null
    this.checkPosition()  // Ĭ�ϵ���һ�Σ���ʼ��һ��λ��
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

    // ��ȡ�̶���λԪ�ص�offset
  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$window.scrollTop()
    var position  = this.$element.offset()
      console.log(scrollTop,position,position.top - scrollTop);
    return (this.pinnedOffset = position.top - scrollTop)
  }

    // click�¼�ʱ�����ô˷�������λ��
  Affix.prototype.checkPositionWithEventLoop = function () {
      console.log('checkPositionWithEventLoop');
    setTimeout($.proxy(this.checkPosition, this), 1)  // ʹ��setTimeout��Ŀ�ģ������¼�ѭ�����������(1����)�󣬲ŵ���checkPosition
  }

    // ���¼���λ�õķ���
  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return    // ���Ԫ�ز��ɼ��Ļ���ֱ�ӷ���

    var scrollHeight = $(document).height()  // �����ĵ��ĸ߶�
    var scrollTop    = this.$window.scrollTop()   // �������Ϲ�����ƫ����(��λ����)
    var position     = this.$element.offset()    // ���ظ�Ԫ����Թ�����������ƫ����(��λ����)
    var offset       = this.options.offset   // Ĭ�ϵ�ƫ��������
    var offsetTop    = offset.top    // ����top��ƫ��������
    var offsetBottom = offset.bottom   // �ײ�bottom��ƫ��������

    if (this.affixed == 'top') position.top += scrollTop   // �ж����affix��ʽ��top����scrollTop�ӵ�ԭ����top��

      // ��Ϊoffset֧�ֲ�ͬ�ķ�ʽ��ֵ��������Ҫ�ж��������ֻ��Ƕ������
    if (typeof offset != 'object')         offsetBottom = offsetTop = offset  // ���offset���Ƕ����������һ�����֣���offset��ֵ��offsetBottom��offsetTop
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)  // ���offsetTop�Ǻ������ͽ���ִ�н����ֵ��offsetTop
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)   // ���offsetBottom�Ǻ������ͽ���ִ�н����ֵ��offsetBottom

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

      /*���������У���ӵľ�������Ƕ�׵���Ŀ���ʽ��Ϊ�˸�������⣬�ĳ�if/else����������һ�£�*/

    /*var affix;  // ���unpin��Ϊ�գ�����(��Ļ�����ĸ߶�+unpin)��������С��affixԪ�ص�topֵ�����ʾ���� Ҫ�̶�λ��
    if (this.unpin != null && (
          scrollTop + this.unpin <= position.top
      )) {
      affix = false;
    }
    else {
      // ���offsetBottom��Ϊ�գ�����(Ԫ�ص�topֵ+Ԫ�صĸ߶�)> = (�����߶�-offsetBottom)
        if (offsetBottom != null && (
                position.top + this.$element.height() >= scrollHeight - offsetBottom
            )) {        // ���ʾaffixģʽΪbottom
            affix = "bottom";
        }
    else
      {
          // ���offsetTop��Ϊ�գ����(�����߶�)< = (���õ�offsetTop)�����ʾaffixģʽΪtop
          // (����ģʽ)
          if (offsetTop != null && (
                  scrollTop <= offsetTop
              )
      )
          {
              affix = "top";
          }
      else
          {
              affix = false;
          }
      }
    }*/

    if (this.affixed === affix) return  // ���ԭ����״̬�����ڼ����״̬һ�µĻ����Ͳ���Ҫ������
    if (this.unpin) this.$element.css('top', '')  // ���Ϊunpin�������topֵ

    var affixType = 'affix' + (affix ? '-' + affix : '')   // �ж�affix����
    var e         = $.Event(affixType + '.bs.affix')  // ����Ҫ������affix�¼�

    this.$element.trigger(e)  // ����affix�¼�

    if (e.isDefaultPrevented()) return

    this.affixed = affix   // �����µ�affix״̬��ֵ��affixed
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null    // �����bottomģʽ����ͨ��getPinnedOffset��ȡ

    this.$element
      .removeClass(Affix.RESET)    // ɾ�����е�affix��ʽ
      .addClass(affixType)         // ��������µ���ʽ�����affixģʽ��Ϊ��
      .trigger($.Event(affixType.replace('affix', 'affixed')))     // �������ͣ�������Ӧ��affixed�¼�

      // �����bottomģʽ������������Ԫ��offset���topֵ
    if (affix == 'bottom') {
      this.$element.offset({ top: scrollHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix   // �����������$.fn.affix����(�������Ļ�)���Ա���noConflict֮�󣬿��Լ���ʹ�ø��ϴ���

  $.fn.affix = function (option) {
    return this.each(function () {  // �������з��Ϲ����Ԫ��
      var $this   = $(this)    // ��ǰ����Ԫ�ص�jQuery����
      var data    = $this.data('bs.affix')   // ��ȡ�Զ�������data-bs.affix��ֵ(��ʵ��affixʵ��)
      var options = typeof option == 'object' && option   // �ϲ�����

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))    // ���û��Affixʵ�����ͳ�ʼ��һ����������this�Ͳ���
      if (typeof option == 'string') data[option]()    // ���option���ַ��������ʾֱ�ӵ��ø�ʵ���ϵ�ͬ������
    })
  }

  $.fn.affix.Constructor = Affix    // ��������������������ͨ�������Ի�ȡ�������ʵ�ຯ��


  // AFFIX NO CONFLICT
  // =================


    /*������ͻ���� */
  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

    // �󶨴����¼�
  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {    // �������з��Ϲ����Ԫ��
      var $spy = $(this)   // ��ʱ��ֵ����
      var data = $spy.data()   // �ռ���Ԫ���ϵ��Զ�������(data-��ͷ)
      data.offset = data.offset || {}    // ���������offset��ʹ����������һ��Ĭ�Ͽ�ֵ

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)   // ʵ�������(���ռ�data-����)���Ա��Զ�����
    })
  })

}(jQuery);
