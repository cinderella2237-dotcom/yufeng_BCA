/* Copyright (C) 2026 Cinderella_yufeng; SPDX-License-Identifier: AGPL-3.0-only */
/* Protocol examples transcribed from linked manufacturer documents.
   Concentrations are illustrative working standards, not stock concentrations. */
window.BCA_KIT_PRESETS = [
  {
    id: 'lab-six',
    name: '实验室自定义示例：六点 BCA',
    concentrations: [0, 0.125, 0.25, 0.5, 1, 2], unit: 'mg',
    standardTotal: 12.5, sampleAliquot: 12.5, sampleTotal: 12.5, reagent: 100,
    method: 'linear', source: '',
    note: '六点、12.5 µL + 100 µL 为实验室自定义示例，不代表厂商验证方案；请按实际实验修改。'
  },
  {
    id: 'pierce-23225',
    name: 'Thermo Pierce BCA 23225/23227：微孔板',
    concentrations: [0, 0.025, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2], unit: 'mg',
    standardTotal: 25, sampleAliquot: 25, sampleTotal: 25, reagent: 200,
    method: 'quadratic',
    source: 'https://tools.thermofisher.com/content/sfs/manuals/MAN0011430_Pierce_BCA_Protein_Asy_UG.pdf',
    note: '25 µL 常规微孔板方案；说明书标准系列含九点（含空白），标示工作范围 20–2000 µg/mL。默认二次回归，请按实验验证选择拟合方式。'
  },
  {
    id: 'beyotime-p0012',
    name: '碧云天 P0012：普通型微孔板',
    concentrations: [0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200,
    method: 'linear',
    source: 'https://www.beyotime.com/Manual/P0012%20BCA%E8%9B%8B%E7%99%BD%E6%B5%93%E5%BA%A6%E6%B5%8B%E5%AE%9A%E8%AF%95%E5%89%82%E7%9B%92.pdf',
    note: '说明书示例为八点（含空白），标准品与样品补足至 20 µL；厂家标示较好线性范围为 50–2000 µg/mL。'
  },
  {
    id: 'beyotime-p0010s',
    name: '碧云天 P0010S：增强型微孔板',
    concentrations: [0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200,
    method: 'linear',
    source: 'https://m.beyotime.com/Manual/P0010S%20BCA%E8%9B%8B%E7%99%BD%E6%B5%93%E5%BA%A6%E6%B5%8B%E5%AE%9A%E8%AF%95%E5%89%82%E7%9B%92_%E5%A2%9E%E5%BC%BA%E5%9E%8B_.pdf',
    note: '说明书示例为八点（含空白），标准品与样品补足至 20 µL；厂家标示较好线性范围为 20–1000 µg/mL。'
  },
  {
    id: 'solarbio-pc0020',
    name: '索莱宝 PC0020：微孔板',
    concentrations: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200,
    method: 'linear',
    source: 'https://www.solarbio.com/images/202507/1752228854113948235.pdf',
    note: '说明书微孔板示例为八点（含空白）；请核对批次说明书及本次实际配制的标准浓度。'
  },
  {
    id: 'vazyme-e112',
    name: '诺唯赞 E112 V22.1：微孔板',
    concentrations: [0, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200,
    method: 'linear',
    source: 'https://www.biorbyt.com/images/pub/media/additional_documents/New_site/Manual/vazyme/E112-01.pdf?timestamp=20260128',
    note: '依据 V22.1 说明书中每孔 0–20 µg 蛋白量和 20 µL 体积换算为浓度；请确认标准品批次及实际制备方法。'
  },
  {
    id: 'micro-bca-23235',
    name: 'Thermo Micro BCA 23235：微孔板',
    concentrations: [0, 2.5, 5, 10, 20, 40], unit: 'ug',
    standardTotal: 150, sampleAliquot: 150, sampleTotal: 150, reagent: 150,
    method: 'quadratic',
    source: 'https://documents.thermofisher.com/TFS-Assets%2FLSG%2Fmanuals%2FMAN0011237_Micro_BCA_Protein_Asy_UG.pdf',
    note: '按说明书标准液系列及微孔板 2–40 µg/mL 工作范围整理的示例点；说明书建议使用多项式或逐点拟合，请确认本次实际梯度。'
  },
  {
    id: 'custom',
    name: '其他试剂盒 / 完全自定义',
    concentrations: [0, 0.125, 0.25, 0.5, 1, 2], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200,
    method: 'linear', source: '',
    note: '请按本次实验填写全部参数与标准梯度；示例值不代表任何厂商的验证范围。'
  }
];
