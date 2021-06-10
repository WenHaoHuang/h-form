<!--
 * @Author       : wenhao.huang
 * @Date         : 2020-06-16 11:43:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-10 23:08:57
-->
<template>
  <el-form-item
    v-if="isVisible"
    :label="options.label"
    :prop="prop"
    :rules="rules"
    :required="required"
    :class="[
      options.span ? `span__${options.span}` : span !== 24 ? `span__${span}` : '',
      {
        'span__clearfix': options.clearfix
      }
    ]"
  >
    <template
      v-if="hasLabel"
      #label
    >
      <div class="h-form--item__label">
        <span>{{ options.label }}</span>
        <el-tooltip
          v-if="options.tooltip"
          class="item"
          effect="dark"
          placement="top"
        >
          <!-- eslint-disable -->
          <div
            slot="content"
            v-html="options.tooltip"
          />
          <!-- eslint-enable -->
          <i class="el-icon-warning-outline h-form--item__label-tooltip" />
        </el-tooltip>
        <span v-if="options.label">：</span>
      </div>
    </template>
    <template v-if="options.type === 'checkbox-group'">
      <el-checkbox-group
        v-model="SdFormer.model[prop]"
        :disabled="isDisabled"
        v-bind="options.props"
        v-on="options.on"
      >
        <el-checkbox
          v-for="(child, index) in options.children"
          :key="index"
          :label="(child.value === undefined || child.value === null) ? child.label : child.value"
          v-bind="child.props"
          v-on="child.on"
        >
          {{ child.label }}
        </el-checkbox>
      </el-checkbox-group>
    </template>
    <template v-else-if="options.type === 'radio-group'">
      <el-radio-group
        v-model="SdFormer.model[prop]"
        :disabled="isDisabled"
        v-bind="options.props"
        v-on="options.on"
      >
        <el-radio
          v-for="child in options.children"
          :key="`${child.label}_${child.value}`"
          :label="(child.value === undefined || child.value === null) ? child.label : child.value"
          v-bind="child.props"
          v-on="child.on"
        >
          {{ child.label }}
        </el-radio>
      </el-radio-group>
    </template>
    <template v-else-if="options.type === 'select'">
      <el-select
        v-model="SdFormer.model[prop]"
        :disabled="isDisabled"
        v-bind="options.props"
        v-on="options.on"
      >
        <el-option
          v-for="child in options.children"
          :key="`${child.label}_${child.value}`"
          :label="child.label"
          :value="(options.props && options.props.valueKey) ? child : ((child.value === undefined || child.value === null) ? child.label : child.value)"
          :disabled="child.disabled"
        />
      </el-select>
    </template>
    <template v-else-if="options.type === 'groups'">
      <div class="h-form--item__group">
        <template v-for="(item, index) in options.children">
          <sd-form-item
            :key="index"
            :prop="index"
            :options="item"
            :has-label="false"
            :rules="item.rules || (SdFormer.rules && SdFormer.rules[index]) || undefined"
            :visible="item.visible"
            :disabled="item.disalbed"
            class="h-form--item__group--item"
          />
        </template>
      </div>
    </template>
    <template v-else-if="options.type === 'label'">
      <span class="h-form--item__text">{{ SdFormer.model[prop] }}</span>
    </template>
    <sd-form-render
      v-else-if="options.type === 'render'"
      :options="options"
    />
    <template v-else-if="options.type === 'input'">
      <el-input
        v-model="SdFormer.model[prop]"
        :disabled="isDisabled"
        v-bind="options.props"
        v-on="options.on"
      >
        <template v-if="options.slot">
          <template
            v-for="(item, index) in options.slot"
            :slot="item.key"
          >
            <span
              v-if="item.type === 'text'"
              :key="index"
            >
              {{ item.text }}
            </span>
            <el-select
              v-if="item.type === 'select'"
              :key="index"
              v-model="SdFormer.model[item.modelKey]"
              class="h-form--item__input-sel"
              placeholder="请选择"
              :style="item.width ? { width: item.width } : {}"
              v-bind="item.props"
              v-on="item.on"
            >
              <el-option
                v-for="option in item.children"
                :key="`${option.label}_${option.value}`"
                :label="option.label"
                :value="(option.value === undefined || option.value === null) ? option.label : option.value"
              />
            </el-select>
          </template>
        </template>
      </el-input>
    </template>
    <component
      :is="`el-${options.type}`"
      v-else
      v-model="SdFormer.model[prop]"
      :disabled="isDisabled"
      v-bind="options.props"
      v-on="options.on"
    />
  </el-form-item>
</template>
<script>
import SdFormRender from './form-render.js'

export default {
  name: 'SdFormItem',
  components: {
    SdFormRender,
    SdFormLabel: {
      name: 'SdFormLabel',
      functional: true,
      render: (createElement, context) => {
        const {props, parent} = context;
        const {render} = props;
        const {prop, SdFormer} = parent;
        return render(createElement, {prop, model: SdFormer.model})
      }
    }
  },
  inject: ['SdFormer'],
  props: {
    prop: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {}
    },
    span: {
      type: Number,
      default: undefined
    },
    rules: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: undefined
    },
    visible: {
      type: [Boolean, Function],
      default: undefined
    },
    hasLabel: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: [Boolean, Function],
      default: undefined
    },
  },
  computed: {
    isVisible() {
      if(this.visible === undefined) {
        return true;
      } else if(typeof this.visible === 'function') {
        return this.visible(this.SdFormer.model)
      } else {
        return this.visible
      }
    },
    isDisabled() {
      if(this.disabled === undefined) {
        return this.options.props?.disabled;
      } else if(typeof this.disabled === 'function') {
        return this.disabled(this.SdFormer.model)
      } else {
        return this.disabled
      }
    }
  },
}
</script>
