export default {
  name: "SdFormRender",
  inject: ["SdFormer"],
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  render(h) {
    const { options, SdFormer } = this;
    const { render } = options;
    return render(h, { model: SdFormer?.model });
  }
};
