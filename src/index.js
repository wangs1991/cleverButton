/**
 * Created by vonsh on 2018/6/20
 */
import RespButtonComponent from './components/button.vue'

let BUTTONPOOL = {};
let ID = 0;
let stock = [];  // FIFO原则
let STATES = ['NORMAL', 'ACTION', 'PEDDING', 'COMPLETE'];
let timer = {};
export default {
  install(Vue, options = {
    stages: [{
      className: 'button-error',
      label: '出错',
      state: 'ERROR',
      callback: function () { }
    }, {
      className: 'button',
      label: '提交',
      state: 'NORMAL',
      callback: function () {
      }
    }
    /*, {
      className: 'button-actting',
      label: '正在校验输入项',
      state: 'ACTION',
      callback: function () { }
    }*/
    , {
      className: 'button-pendding',
      label: '正在提交请稍等...',
      state: 'PEDDING',
      callback: function () { }
    }, {
      className: 'button-success',
      label: '提交成功',
      state: 'COMPLETE',
      callback: function () { }
    }],
    delay: 1.5
  }) {
    STATES = options.stages;
    let avaliableState = (function () {
      let ls = [];
      STATES.forEach((n, i) => {
        ls.push(n.state)
      })
      return ls
    })()
    // register global component
    Vue.component('respButton', RespButtonComponent)

    Vue.mixin({
      created: function () {  // 3. 通过全局 mixin方法添加一些组件选项，如: vuex
        // add the cache pool to Vue prototype
        this.respButton = {
          pool: BUTTONPOOL || {},
          stock: stock || [],
          options: options
        };
      }
    })

    // add methods to the Vue prototype.
    Vue.prototype.$subscribe = function (id = ++ID, options = {
      state: 'NORMAL',
      label: STATES[1].label,
      className: STATES[1].className,
      id: id
    }) {
      this.respButton.pool[id] = options
      this.name = options.label
      this.className = options.className
      this.state = options.state
      return id;
    }
    Vue.prototype.$remove = function () {

    }
    Vue.prototype.$trigger = function (id, forceState, args) {
      if (!id) {
        id = this.respButton.stock.shift()
      }
      this.respButton.stock.shift()

      // 为了防止定时器冲突，ERROR状态下，除非置成初始状态，否则不允许操作
      if (this.respButton.pool[id].state.search(/ERROR/i) >=0 && !forceState) {
        return false
      }

      // 用户指定跳转到某个状态
      if (forceState) {
        let state;
        let className;
        let label;
        if (typeof forceState === 'string') {
          state = forceState;
        } else {
          state = forceState.state;
          className = forceState.className;
          label = forceState.label;
        }

        let idx = avaliableState.indexOf(state)
        if (idx < 0) {
          console.warn('The state' + state+ 'cannot be found. It can be one of the ' + avaliableState.join(',') + '.');
          return false;
        }
        this.respButton.pool[id].state = STATES[idx].state
        this.respButton.pool[id].label = label || STATES[idx].label
        this.className = className || STATES[idx].className
        this.state = this.respButton.pool[id].state
        this.name = this.respButton.pool[id].label
        STATES[idx].callback && STATES[idx].callback.call(this, id, args)
        if(state.search(/ERROR/i) >= 0){
          let self = this
          clearTimeout(timer[id])
          timer[id] = setTimeout(function () {
            self.$trigger(id, 'NORMAL')
            clearTimeout(timer[id])
          }, options.delay*1000)
        }
        return state;
      }


      // 自然按顺序跳转
      let state = this.respButton.pool[id].state
      let idx = (function () {
        let rs = -1;
        STATES.forEach((n, i) => {
          if (n.state === state) {
            return rs = i;
          }
        })
        return rs;
      })()
      if (idx < STATES.length - 1) {
        idx = idx + 1
        this.respButton.stock.push(id)
        try {
          if (this.$el.tagName.toLowerCase() !== 'button') {
            throw new Error('请在按钮组件上调用trigger方法！');
          }
        } catch (e) {
          console.warn(e.message);
        }
        this.respButton.pool[id].state = STATES[idx].state
        this.respButton.pool[id].label = STATES[idx].label
        this.className = STATES[idx].className
        this.state = this.respButton.pool[id].state
        this.name = this.respButton.pool[id].label
        STATES[idx].callback && STATES[idx].callback.call(this, id, args)
      } else if(state.search(/COMPLETE/i) >= 0){
        let self = this
        clearTimeout(timer[id])
        timer[id] = setTimeout(function () {
          self.$trigger(id, 'NORMAL')
          clearTimeout(timer[id])
        }, options.delay*1000)
      }


      return this.respButton.pool[id].state
    }
  }
}
