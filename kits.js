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
    id: 'servicebio-g2026', name: '赛维尔 Servicebio G2026-200T：微孔板',
    concentrations: [0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200, method: 'linear',
    source: 'https://www.servicebio.com/goodsdetail?id=1825',
    note: 'G2026 微孔板示例：标准品补足至 20 µL，配制点为 0–0.5 mg/mL；该系列不是产品标示的全部工作范围。请核对批次说明书及实际加样。'
  },
  {
    id: 'yeasen-20200', name: '翌圣 Yeasen 20200ES76：即用型微孔板',
    concentrations: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2], unit: 'mg',
    standardTotal: 25, sampleAliquot: 25, sampleTotal: 25, reagent: 200, method: 'linear',
    source: 'https://www.yeasen.com/products/detail/10090',
    note: '20200ES76 即用型八点标准；微孔板示例为 25 µL 标准品或样品加 200 µL 工作液，请核对所购批次说明书。'
  },
  {
    id: 'epizyme-zj102', name: '雅酶 Epizyme ZJ102：即用型微孔板',
    concentrations: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200, method: 'linear',
    source: 'https://www.epizyme.cn/uploads/2020/12/091001415357.pdf',
    note: 'ZJ102 即用型八点示例：标准品及样品各 20 µL，每孔工作液 200 µL；请核对所购批次说明书。'
  },
  {
    id: 'aike-x-bca500', name: '艾克生命 X-BCA500：10 µL 样品方案',
    concentrations: [0, 2.5, 5, 7.5, 10], unit: 'mg',
    standardTotal: 10, sampleAliquot: 10, sampleTotal: 10, reagent: 200, method: 'linear',
    assayMode: 'x-bca-10', blankMode: 'none', stdReps: 3,
    source: 'https://www.fansbio.com/product/x-bca500',
    note: 'X-BCA500 特殊方案：标准品 X 分别加 0、5、10、15、20 µL，不补液；样品加 10 µL，工作液 200 µL。0、2.5、5、7.5、10 mg/mL 是对应 10 µL 样品的等效浓度，并非标准液浓度。按所引说明使用原始读数、不扣空白；5 或 20 µL 样品等其他方案暂不支持。'
  },
  {
    id: 'glpbio-gk10009', name: 'GLPBIO GK10009：即用型微孔板',
    concentrations: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2], unit: 'mg',
    standardTotal: 25, sampleAliquot: 25, sampleTotal: 25, reagent: 200, method: 'linear',
    source: 'https://www.glpbio.com/jp/bca-protein-assay-kit.html',
    note: 'GK10009 即用型八点标准；微孔板示例为 25 µL 标准品或样品加 200 µL 工作液。产品资料中的检测范围描述存在不一致，请核对批次说明书并验证实际范围。'
  },
  {
    id: 'proteintech-pk10026', name: '武汉三鹰 Proteintech PK10026：微孔板',
    concentrations: [0, 0.025, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200, method: 'linear',
    source: 'https://www.ptgcn.com/products/BCA-Protein-Assay-Kit-PK10026.htm',
    note: 'PK10026 微孔板九点示例，20 µL 标准品或样品加 200 µL 工作液。官方不同版本的部分稀释表有差异，请确认实际配制浓度，不应只按预设推定。'
  },
  {
    id: 'takara-t9300a-standard', name: 'Takara T9300A：标准微孔板',
    concentrations: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2], unit: 'mg',
    standardTotal: 25, sampleAliquot: 25, sampleTotal: 25, reagent: 200, method: 'linear',
    source: 'https://www.takarabiomed.com.cn/DownLoad/T9300A.pdf',
    note: 'T9300A 标准微孔板方案：25 µL 标准品或样品加 200 µL 工作液；工作液 A:B 为 100:1。低浓度微孔板方案请使用单独选项。'
  },
  {
    id: 'takara-t9300a-low', name: 'Takara T9300A：低浓度微孔板',
    concentrations: [0, 5, 10, 20, 50, 100, 150, 200], unit: 'ug',
    standardTotal: 100, sampleAliquot: 100, sampleTotal: 100, reagent: 100, method: 'linear',
    source: 'https://www.takarabiomed.com.cn/DownLoad/T9300A.pdf',
    note: 'T9300A 低浓度微孔板方案：100 µL 标准品或样品加 100 µL 工作液，标准点单位为 µg/mL；流程与标准方案不同。'
  },
  {
    id: 'meilun-ma0082', name: '美仑生物 MeilunBio MA0082：微孔板',
    concentrations: [0, 0.025, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200, method: 'linear',
    source: 'https://meilunhelper.com/uploads/guide/MA0082.pdf',
    note: 'MA0082 微孔板九点示例：20 µL 标准品或样品加 200 µL 工作液；说明书标示较好线性范围 0.05–1 mg/mL，标准点最高为 2 mg/mL。不同规格 BSA 复溶浓度不同，请核对批次说明书与实际配制浓度。'
  },
  {
    id: 'meilun-ma1610', name: '美仑生物 MeilunBio MA1610：即用型快速微孔板',
    concentrations: [0, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200, method: 'linear',
    source: 'https://meilunhelper.com/uploads/guide/MA1610.pdf',
    note: 'MA1610 即用型快速方案：20 µL 标准品或样品加 200 µL 工作液，说明书使用 480 nm、室温显色 5 分钟；须核对读数时间及所购批次说明书。'
  },
  {
    id: 'meilun-ma1611', name: '美仑生物 MeilunBio MA1611：即用型快速微孔板',
    concentrations: [0, 0.125, 0.25, 0.5, 1, 2, 5, 10], unit: 'mg',
    standardTotal: 10, sampleAliquot: 10, sampleTotal: 10, reagent: 200, method: 'linear',
    source: 'https://meilunhelper.com/uploads/guide/MA1611.pdf',
    note: 'MA1611 即用型快速方案：10 µL 标准品或样品加 200 µL 工作液，说明书使用 480 nm、室温显色 5 分钟；须核对读数时间及所购批次说明书。'
  },
  {
    id: 'epizyme-zj101', name: '雅酶 Epizyme ZJ101：微孔板',
    concentrations: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1, 1.5, 2], unit: 'mg',
    standardTotal: 20, sampleAliquot: 20, sampleTotal: 20, reagent: 200, method: 'linear',
    source: 'https://www.epizyme.cn/uploads/2022/01/100933587792.pdf',
    note: 'ZJ101 微孔板示例：标准品须配制并补足至 20 µL，样品为 20 µL，每孔工作液 200 µL。标准梯度与 ZJ102 即用型不同，请按实际配制浓度填写。'
  },
  {
    id: 'yeasen-20201es86', name: '翌圣 Yeasen 20201ES86：增强型微孔板',
    concentrations: [0, 0.04, 0.2, 0.4, 0.6, 1, 1.2, 1.4, 2], unit: 'mg',
    standardTotal: 25, sampleAliquot: 25, sampleTotal: 25, reagent: 200, method: 'linear',
    source: 'https://www.biomart.cn/infosupply/104233694.htm',
    note: '20201ES86 增强型说明书的微孔板示例：25 µL 标准品或样品加 200 µL 工作液；九点梯度须自行配制，与 20200ES76 即用型不同。请核对所购批次说明书和实际浓度。'
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
