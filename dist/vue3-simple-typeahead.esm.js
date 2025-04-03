import { defineComponent, pushScopeId, popScopeId, openBlock, createElementBlock, withDirectives, createElementVNode, mergeProps, withKeys, withModifiers, vModelText, renderSlot, createCommentVNode, Fragment, renderList, normalizeClass } from 'vue';

var script = defineComponent({
  name: 'Vue3SimpleTypeahead',
  emits: ['onInput', 'onFocus', 'onBlur', 'selectItem'],
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      required: true
    },
    defaultItem: {
      default: null
    },
    itemProjection: {
      type: Function,

      default(item) {
        return item;
      }

    },
    minInputLength: {
      type: Number,
      default: 2,
      validator: val => val >= 0
    },
    minItemLength: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    selectOnTab: {
      type: Boolean,
      default: true
    },
    tokenizedMatches: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      inputId: this.id || `simple_typeahead_${(Math.random() * 1000).toFixed()}`,
      input: '',
      isInputFocused: false,
      currentSelectionIndex: 0
    };
  },

  mounted() {
    if (this.defaultItem !== undefined && this.defaultItem !== null) {
      this.selectItem(this.defaultItem);
    }
  },

  methods: {
    onInput() {
      if (this.isListVisible && this.currentSelectionIndex >= this.filteredItems.length) {
        this.currentSelectionIndex = Math.max(this.filteredItems.length - 1, 0);
      }

      this.$emit('onInput', {
        input: this.input,
        items: this.filteredItems
      });
    },

    onFocus() {
      this.isInputFocused = true;
      this.$emit('onFocus', {
        input: this.input,
        items: this.filteredItems
      });
    },

    onBlur() {
      this.isInputFocused = false;
      this.$emit('onBlur', {
        input: this.input,
        items: this.filteredItems
      });
    },

    onArrowDown() {
      if (this.isListVisible && this.currentSelectionIndex < this.filteredItems.length - 1) {
        this.currentSelectionIndex++;
      }

      this.scrollSelectionIntoView();
    },

    onArrowUp() {
      if (this.isListVisible && this.currentSelectionIndex > 0) {
        this.currentSelectionIndex--;
      }

      this.scrollSelectionIntoView();
    },

    scrollSelectionIntoView() {
      this.$nextTick(() => {
        const listNode = document.querySelector(`#${this.wrapperId} .simple-typeahead-list`);
        const activeNode = document.querySelector(`#${this.wrapperId} .simple-typeahead-list-item.simple-typeahead-list-item-active`);
        if (!listNode || !activeNode) return;

        if (!(activeNode.offsetTop >= listNode.scrollTop && activeNode.offsetTop + activeNode.offsetHeight < listNode.scrollTop + listNode.offsetHeight)) {
          let scrollTo = 0;

          if (activeNode.offsetTop > listNode.scrollTop) {
            scrollTo = activeNode.offsetTop + activeNode.offsetHeight - listNode.offsetHeight;
          } else if (activeNode.offsetTop < listNode.scrollTop) {
            scrollTo = activeNode.offsetTop;
          }

          listNode.scrollTo(0, scrollTo);
        }
      });
    },

    selectCurrentSelection() {
      if (this.currentSelection) {
        this.selectItem(this.currentSelection);
      }
    },

    selectCurrentSelectionTab() {
      if (this.selectOnTab) {
        this.selectCurrentSelection();
      } else {
        this.$refs.inputRef.blur();
      }
    },

    selectItem(item) {
      this.input = this.itemProjection(item);
      this.currentSelectionIndex = 0;
      this.$refs.inputRef.blur();
      this.$emit('selectItem', item);
    },

    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    boldMatchText(text) {
      // Split the user input by whitespace and highlight each found token.
      const tokens = this.input.trim().split(/\s+/);
      let highlighted = text;
      tokens.forEach(token => {
        if (!token) return;
        const re = new RegExp(`(${this.escapeRegExp(token)})`, 'ig');
        highlighted = highlighted.replace(re, '<strong>$1</strong>');
      });
      return highlighted;
    },

    clearInput() {
      this.input = '';
    },

    getInput() {
      return this.$refs.inputRef;
    },

    focusInput() {
      this.$refs.inputRef.focus();
      this.onFocus();
    },

    blurInput() {
      this.$refs.inputRef.blur();
      this.onBlur();
    }

  },
  computed: {
    wrapperId() {
      return `${this.inputId}_wrapper`;
    },

    filteredItems() {
      const userInput = this.input.trim();

      if (!userInput) {
        return this.items;
      }

      if (!this.tokenizedMatches) {
        const regexp = new RegExp(this.escapeRegExp(this.input), 'i');
        return this.items.filter(item => this.itemProjection(item).match(regexp));
      } // Split user input into tokens and lowercase them


      const tokens = userInput.split(/\s+/).map(t => t.toLowerCase());
      return this.items.filter(item => {
        // Lowercase the projected text
        const text = this.itemProjection(item).toLowerCase(); // Keep if at least one token matches

        return tokens.some(token => text.includes(token));
      });
    },

    isListVisible() {
      return this.isInputFocused && this.input.length >= this.minInputLength && this.filteredItems.length > this.minItemLength;
    },

    currentSelection() {
      return this.isListVisible && this.currentSelectionIndex < this.filteredItems.length ? this.filteredItems[this.currentSelectionIndex] : undefined;
    }

  }
});

pushScopeId("data-v-99a07096");

const _hoisted_1 = ["id"];
const _hoisted_2 = ["id", "placeholder"];
const _hoisted_3 = {
  key: 0,
  class: "simple-typeahead-list"
};
const _hoisted_4 = {
  key: 0,
  class: "simple-typeahead-list-header"
};
const _hoisted_5 = ["onClick", "onMouseenter"];
const _hoisted_6 = ["data-text"];
const _hoisted_7 = ["data-text", "innerHTML"];
const _hoisted_8 = {
  key: 1,
  class: "simple-typeahead-list-footer"
};

popScopeId();

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    id: _ctx.wrapperId,
    class: "simple-typeahead"
  }, [withDirectives(createElementVNode("input", mergeProps({
    ref: "inputRef",
    id: _ctx.inputId,
    class: "simple-typeahead-input",
    type: "text",
    placeholder: _ctx.placeholder,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.input = $event),
    onInput: _cache[1] || (_cache[1] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
    onFocus: _cache[2] || (_cache[2] = (...args) => _ctx.onFocus && _ctx.onFocus(...args)),
    onBlur: _cache[3] || (_cache[3] = (...args) => _ctx.onBlur && _ctx.onBlur(...args)),
    onKeydown: [_cache[4] || (_cache[4] = withKeys(withModifiers((...args) => _ctx.onArrowDown && _ctx.onArrowDown(...args), ["prevent"]), ["down"])), _cache[5] || (_cache[5] = withKeys(withModifiers((...args) => _ctx.onArrowUp && _ctx.onArrowUp(...args), ["prevent"]), ["up"])), _cache[6] || (_cache[6] = withKeys(withModifiers((...args) => _ctx.selectCurrentSelection && _ctx.selectCurrentSelection(...args), ["prevent"]), ["enter"])), _cache[7] || (_cache[7] = withKeys(withModifiers((...args) => _ctx.selectCurrentSelectionTab && _ctx.selectCurrentSelectionTab(...args), ["prevent"]), ["tab"]))],
    autocomplete: "off"
  }, _ctx.$attrs), null, 16, _hoisted_2), [[vModelText, _ctx.input]]), _ctx.isListVisible ? (openBlock(), createElementBlock("div", _hoisted_3, [_ctx.$slots['list-header'] ? (openBlock(), createElementBlock("div", _hoisted_4, [renderSlot(_ctx.$slots, "list-header")])) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.filteredItems, (item, index) => {
    return openBlock(), createElementBlock("div", {
      class: normalizeClass(["simple-typeahead-list-item", {
        'simple-typeahead-list-item-active': _ctx.currentSelectionIndex == index
      }]),
      key: index,
      onMousedown: _cache[8] || (_cache[8] = withModifiers(() => {}, ["prevent"])),
      onClick: $event => _ctx.selectItem(item),
      onMouseenter: $event => _ctx.currentSelectionIndex = index
    }, [_ctx.$slots['list-item-text'] ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: "simple-typeahead-list-item-text",
      "data-text": _ctx.itemProjection(item)
    }, [renderSlot(_ctx.$slots, "list-item-text", {
      item: item,
      itemProjection: _ctx.itemProjection,
      boldMatchText: _ctx.boldMatchText
    })], 8, _hoisted_6)) : (openBlock(), createElementBlock("span", {
      key: 1,
      class: "simple-typeahead-list-item-text",
      "data-text": _ctx.itemProjection(item),
      innerHTML: _ctx.boldMatchText(_ctx.itemProjection(item))
    }, null, 8, _hoisted_7))], 42, _hoisted_5);
  }), 128)), _ctx.$slots['list-footer'] ? (openBlock(), createElementBlock("div", _hoisted_8, [renderSlot(_ctx.$slots, "list-footer")])) : createCommentVNode("", true)])) : createCommentVNode("", true)], 8, _hoisted_1);
}

script.render = render;
script.__scopeId = "data-v-99a07096";

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = script; // Attach install function executed by Vue.use()

  installable.install = app => {
    app.component('Vue3SimpleTypeahead', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
