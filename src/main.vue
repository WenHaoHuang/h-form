<template>
  <el-form
    ref="form"
    :model="model"
    :label-width="labelWidthCalc"
    class="h-form"
    :rules="rules"
    :label-position="labelPosition"
    :label-suffix="labelSuffix"
    :style="styleFn"
  >
    <template v-for="(item, index) in options">
      <div
        v-if="item.clearfix"
        :key="`driver_${index}`"
        :class="['h-form__driver', `span__${Number(item.clearfixSpan) || 24}`]"
      />
      <sd-form-item
        v-if="!item.hide"
        :key="index"
        :prop="index"
        :options="item"
        :span="span"
        :rules="item.rules || (rules && rules[index]) || undefined"
        :required="item.required"
        :visible="item.visible"
        :disabled="item.disabled"
      />
    </template>
    <el-form-item
      v-if="!hideFooter"
      :class="['el-form-btns']"
    >
      <el-button
        v-if="!hideSubmit"
        type="primary"
        @click="onSubmit"
      >
        {{ submitText }}
      </el-button>
      <el-button
        v-if="!hideCancel"
        @click="onCancel"
      >
        {{ cancelText }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import SdFormItem from "./form-item.vue";
export default {
  name: "HForm",
  components: { SdFormItem },
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: ""
    },
    labelSuffix: {
      type: String,
      default: "："
    },
    labelPosition: {
      type: String,
      default: ""
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: "提交"
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    hideSubmit: {
      type: Boolean,
      default: false
    },
    hideCancel: {
      type: Boolean,
      default: false
    },
    span: {
      type: Number,
      default: 24
    },
    formWidth: {
      type: String,
      default: ''
    },
    formAlign: {
      type: String,
      default: 'left'
    },
    gap: {
      type: Number,
      default: 20
    }
  },
  provide() {
    return {
      SdFormer: this
    };
  },
  computed: {
    styleFn() {
      const data = {}
      const {formWidth, formAlign, gap, span} = this;
      if(formWidth) {
        data.width = formWidth
      }
      if(formAlign === 'center') {
        data.marginLeft = 'auto'
        data.marginRight = 'auto'
      }
      if(formAlign === 'right') {
        data.marginLeft = 'auto'
        data.marginRight = 0
      }
      if( gap !== 20) {
        data.gridColumnGap = `${gap}px`
      } else if(span === 24) {
        data.gridColumnGap = 0
      }
      return data;
    },
    labelWidthCalc() {
      if(this.labelWidth) {
        // 如果配置label宽度，采用配置值
        return this.labelWidth
      } else {
        // 不配置时，自动计算
        let labelWidth = 1; // 默认带上后面：的空间
        for(const item in this.options) {
          let _width = 1; // 默认带上后面：的空间
          const {label, rules=[], tooltip, required} = this.options[item]
          const _required = rules.find(v=>v.required === true)
          const __required = (this.rules ? (this.rules[item] || []) : []).find(v=>v.required === true)
          _width += required || _required || __required ? 1 : 0
          _width += tooltip ? 2 : 0
          _width += label ? label.length : 0
          labelWidth = _width > labelWidth ? _width : labelWidth;
        }
        return `${labelWidth}em`;
      }
    }
  },
  methods: {
    onSubmit() {
      this.$emit("on-submit", this.model);
    },
    onCancel() {
      this.$emit("on-cancel");
    },
    validate(callback) {
      this.$refs['form'].validate(valid => {
        callback && callback(valid)
      })
    },
  }
};
</script>
