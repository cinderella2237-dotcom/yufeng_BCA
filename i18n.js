/* Copyright (C) 2026 Cinderella_yufeng; SPDX-License-Identifier: AGPL-3.0-only */
(function () {
  'use strict';

  // Chinese source strings are kept so old input formats and backups remain valid.
  var english = {
    "在浏览器中处理不同 BCA 试剂盒的标准曲线和蛋白浓度数据。": "Process standard curves and protein concentrations for multiple BCA kits in your browser.",
    "BCA 蛋白定量计算平台": "BCA Protein Quantification Platform",
    "多试剂盒 · 浏览器本地计算": "MULTIPLE KITS · LOCAL BROWSER CALCULATION",
    "BCA 蛋白": "BCA Protein ",
    "定量平台": "Quantification",
    "选择试剂盒，核对标准梯度，粘贴吸光度，即可计算样品浓度。": "Choose a kit, check your standards, and paste absorbance values to calculate protein concentrations.",
    "使用流程": "Workflow",
    "选择方案与标准梯度": "Choose a protocol and standards",
    "粘贴标准品和样品": "Paste standard and sample data",
    "检查曲线并导出结果": "Review the curve and export",
    "实验设置": "ASSAY SETUP",
    "标准品数据": "STANDARD DATA",
    "样品数据": "SAMPLE DATA",
    "结果": "RESULTS",
    "关于": "ABOUT",
    "选择试剂盒和实验方案": "Choose a kit and protocol",
    "预设为说明书示例，计算前请核对本次实际条件": "Presets are examples; verify the conditions used in your experiment.",
    "试剂盒 / 实验方案": "Kit / protocol",
    "标准浓度单位": "Standard concentration unit",
    "µg / 孔": "µg / well",
    "标准品每个浓度的复孔数": "Replicate wells per standard",
    "查看所选方案的来源说明书": "View the source instructions",
    "保存常用方案（可选）": "Save a reusable protocol (optional)",
    "例如：本实验室 BCA": "e.g. My laboratory BCA protocol",
    "保存到本机": "Save in this browser",
    "删除本机方案": "Delete saved protocol",
    "仅保存方案设置和语言偏好到此浏览器，不保存吸光度或样品名称。": "Only protocol settings and the language preference are stored in this browser, not absorbance values or sample names.",
    "本次实际标准梯度（按粘贴顺序；用逗号、空格或换行分隔）": "Actual standards used (in paste order; separate with commas, spaces, or line breaks)",
    "可直接增删浓度点；标准曲线使用本次实测读数。已扣空白数据可以不含 0 点。": "Add or remove standard points as needed. The curve uses your measured values. A zero point is optional for already blank-corrected data.",
    "当前标准浓度顺序": "Current standard concentration order",
    "体积、拟合与质量控制设置": "Volume, curve fitting, and quality control",
    "标准品加工作液前总体积（µL）": "Standard volume before BCA reagent (µL)",
    "每孔样品实际加入体积（µL）": "Sample volume added per well (µL)",
    "样品补液后、加工作液前总体积（µL）": "Sample volume after topping up, before reagent (µL)",
    "每孔 BCA 工作液体积（µL）": "BCA working reagent per well (µL)",
    "曲线拟合": "Curve fitting",
    "线性回归（含截距）": "Linear regression (with intercept)",
    "二次回归": "Quadratic regression",
    "相邻标准点线性插值": "Point-to-point linear interpolation",
    "输入吸光度的空白处理": "Blank correction for input absorbance",
    "原始读数：扣零浓度标准均值": "Raw readings: subtract the mean zero standard",
    "仪器已扣空白：不再扣除": "Already blank-corrected: do not subtract again",
    "R² 合格门槛（严格大于）": "R² threshold (strictly greater than)",
    "R² 未达标时": "When R² does not meet the threshold",
    "暂停报告浓度": "Do not report concentrations",
    "显示结果并提醒": "Show results with a warning",
    "R² 0.99 是可修改的实验室规则，并非所有试剂盒统一要求；逐点插值没有整体回归 R²。等体积补液的换算不包括 BCA 工作液。": "The default R² of 0.99 is an adjustable laboratory rule, not a universal kit requirement. Point-to-point interpolation has no overall regression R². The top-up correction does not include BCA working reagent.",
    "粘贴标准品吸光度": "Paste standard absorbance",
    "标准品表格方向": "Standard table layout",
    "每列一个浓度，上下为复孔": "Standards in columns",
    "每行一个浓度，左右为复孔": "Standards in rows",
    "标准品吸光度表格": "Standard absorbance table",
    "从 Excel 复制标准品区域并粘贴": "Copy and paste the standard wells from Excel",
    "顺序与上方浓度一致；数据需要本次实测。": "Match the concentration order above and use this experiment's measurements.",
    "导入 CSV / TSV": "Import CSV / TSV",
    "粘贴样品吸光度": "Paste sample absorbance",
    "样品表格方向": "Sample table layout",
    "上下复孔，每组连续若干行": "Vertical replicates",
    "左右复孔，每行一个样品": "Horizontal replicates",
    "每个样品的复孔数": "Replicate wells per sample",
    "统一孔外预稀释倍数": "Common pre-dilution factor",
    "样品吸光度表格": "Sample absorbance table",
    "从 Excel 复制样品区域并粘贴": "Copy and paste the sample wells from Excel",
    "上下复孔按组从左到右编号；缺孔会提示。": "Vertical replicates are paired by column, in row groups. Missing wells are flagged.",
    "各样品稀释倍数或复孔数不同时，可使用带表头的按行表格；按每行实际非空读数取平均：": "For different dilution factors or replicate counts, use one sample per row with a header. Nonempty readings in each row are averaged:",
    "样品名称,吸光度1,吸光度2,稀释倍数": "Sample Name,Absorbance 1,Absorbance 2,Dilution",
    "演示数据为虚构值。": "Demo values are fictional. ",
    "正式计算前请清空并粘贴实际读数。": "Clear them and paste actual readings before reporting results.",
    "计算蛋白浓度": "Calculate concentrations",
    "填入演示数据": "Load demo data",
    "清空读数": "Clear readings",
    "下载数据备份": "Download data backup",
    "导入数据备份": "Import data backup",
    "计算结果": "Results",
    "下载结果 CSV": "Download results CSV",
    "标准曲线": "Standard curve",
    "横轴：浓度（mg/mL） · 纵轴：处理后的吸光度": "X: concentration (mg/mL) · Y: processed absorbance",
    "标准曲线图": "Standard curve chart",
    "标准品均值": "Standard means",
    "拟合曲线": "Fitted curve",
    "曲线信息": "Curve details",
    "空白处理": "Blank correction",
    "非零标准点覆盖范围": "Nonzero standard range",
    "决定系数 R²": "Coefficient of determination R²",
    "曲线表达式": "Curve equation",
    "x：浓度（mg/mL）；y：处理后的吸光度": "x: concentration (mg/mL); y: processed absorbance",
    "样品浓度": "Sample concentrations",
    "原样浓度包含孔外预稀释和加工作液前补液的换算；外推结果会标记。表格可以左右滑动。": "Original concentrations account for pre-dilution and sample top-up. Extrapolated results are flagged. Scroll the table horizontally.",
    "样品名称": "Sample name",
    "复孔1": "Replicate 1",
    "其他复孔": "Other replicates",
    "平均吸光度": "Mean absorbance",
    "处理后": "Processed",
    "复孔 CV": "Replicate CV",
    "预稀释倍数": "Pre-dilution factor",
    "反应前浓度": "Pre-reagent concentration",
    "原样浓度": "Original concentration",
    "状态": "Status",
    "反应前浓度是补液后、加入 BCA 工作液之前的浓度。原样浓度 = 反应前浓度 × 补液总体积 / 实际样品体积 × 孔外预稀释倍数。CV 使用处理后的平均吸光度，均值不大于 0 时不显示。": "Pre-reagent concentration is measured after sample top-up and before BCA reagent is added. Original concentration = pre-reagent concentration × total top-up volume / sample volume × pre-dilution factor. CV uses processed mean absorbance and is omitted when that mean is not positive.",
    "查看标准点与复孔明细": "Standard points and replicate details",
    "标准浓度": "Standard concentration",
    "复孔读数": "Replicate readings",
    "复孔数": "Replicates",
    "使用与数据说明": "Use and data notes",
    "预设仅作为对应说明书的示例；应核对产品货号、说明书版本、实际浓度、样品体积和实验条件。": "Presets are examples from the cited instructions. Check the product number, manual version, concentrations, volumes, and actual experimental conditions.",
    "上方梯度显示的是每个标准点的浓度，不是标准品储备液浓度。质量单位 µg/孔会按标准品加工作液前的总体积换算。": "Enter the concentration of each actual standard point, not the stock concentration. µg/well is converted using the standard volume before BCA reagent.",
    "默认按原始读数扣除零浓度空白；仪器已经扣空白时应选择“已扣空白”，避免重复处理。": "Raw readings are blank-corrected by default. If the instrument already subtracted the blank, select the already-corrected option.",
    "最高标准点不是原样浓度上限。超出实测标准点的结果可按回归方程外推，但准确性需要通过稀释重测或方法验证确认。": "The highest standard is not a limit on the original sample concentration. Values outside the measured standards can be extrapolated, but their accuracy should be verified by dilution and retesting or method validation.",
    "逐点插值没有整体 R²。若选择它并启用 R² 阻断规则，程序不会报告浓度；需根据实验室方法选择质量控制策略。": "Point-to-point interpolation has no overall R². With an R² blocking rule enabled, concentrations will not be reported; choose a quality-control policy appropriate to the laboratory method.",
    "实验数据仅在浏览器中计算，不随本页面的计算过程上传。数据备份和结果文件由用户主动下载保存。试剂盒说明书及商标属于各自权利人。": "Calculations run in your browser; this page does not upload your experimental data for calculation. Backups and results are downloaded only when requested. Kit manuals and trademarks belong to their respective owners.",
    "本工具面向科研和教学开发，未经临床诊断用途验证。各厂商预设与实验室规则均可调整，应以实际说明书及方法验证为准。": "Designed for research and teaching; not validated for clinical diagnosis. Adjust manufacturer examples and laboratory rules to match the applicable instructions and validated method.",
    "AGPL-3.0 开源许可": "AGPL-3.0 license",
    "· 与任何试剂盒厂商无隶属关系": "· Not affiliated with any kit manufacturer",

    "实验室自定义示例：六点 BCA": "Laboratory example: six-point BCA",
    "Thermo Pierce BCA 23225/23227：微孔板": "Thermo Pierce BCA 23225/23227: microplate",
    "碧云天 P0012：普通型微孔板": "Beyotime P0012: standard microplate",
    "碧云天 P0010S：增强型微孔板": "Beyotime P0010S: enhanced microplate",
    "索莱宝 PC0020：微孔板": "Solarbio PC0020: microplate",
    "诺唯赞 E112 V22.1：微孔板": "Vazyme E112 V22.1: microplate",
    "Thermo Micro BCA 23235：微孔板": "Thermo Micro BCA 23235: microplate",
    "其他试剂盒 / 完全自定义": "Other kit / fully custom",
    "六点、12.5 µL + 100 µL 为实验室自定义示例，不代表厂商验证方案；请按实际实验修改。": "This six-point, 12.5 µL + 100 µL protocol is a laboratory example, not a manufacturer-validated method. Adjust it to your experiment.",
    "25 µL 常规微孔板方案；说明书标准系列含九点（含空白），标示工作范围 20–2000 µg/mL。默认二次回归，请按实验验证选择拟合方式。": "The standard 25 µL microplate example includes nine points, including the blank; the stated working range is 20–2000 µg/mL. Quadratic regression is selected by default; use a fitting method validated for your experiment.",
    "说明书示例为八点（含空白），标准品与样品补足至 20 µL；厂家标示较好线性范围为 50–2000 µg/mL。": "The manual example has eight points, including the blank; standards and samples are topped up to 20 µL. The manufacturer states good linearity at 50–2000 µg/mL.",
    "说明书示例为八点（含空白），标准品与样品补足至 20 µL；厂家标示较好线性范围为 20–1000 µg/mL。": "The manual example has eight points, including the blank; standards and samples are topped up to 20 µL. The manufacturer states good linearity at 20–1000 µg/mL.",
    "说明书微孔板示例为八点（含空白）；请核对批次说明书及本次实际配制的标准浓度。": "The manual's microplate example has eight points, including the blank. Verify the batch instructions and actual prepared standards.",
    "依据 V22.1 说明书中每孔 0–20 µg 蛋白量和 20 µL 体积换算为浓度；请确认标准品批次及实际制备方法。": "The V22.1 manual gives 0–20 µg per well; values here are converted to concentration using 20 µL. Check the batch and preparation used.",
    "按说明书标准液系列及微孔板 2–40 µg/mL 工作范围整理的示例点；说明书建议使用多项式或逐点拟合，请确认本次实际梯度。": "Example points selected from the manual's standards and 2–40 µg/mL microplate range. The manual recommends polynomial or point-to-point fitting; verify your actual standards.",
    "请按本次实验填写全部参数与标准梯度；示例值不代表任何厂商的验证范围。": "Enter all settings and standards used in your experiment. These example values are not a manufacturer-validated range.",
    "此方案保存在本浏览器，仅含设置；请核对当前试剂盒和实际操作。": "This protocol is saved in this browser and contains settings only. Check the kit and actual procedure.",
    "说明书示例与自定义": "Manual examples and custom",
    "本浏览器保存的方案": "Saved in this browser",
    "请核对本次实验条件。": "Verify your experimental conditions.",
    "当前方案已编辑，请核对梯度、单位和体积。": "The selected protocol has been edited. Verify concentrations, units, and volumes.",
    "请先填写至少两个有效标准点，再粘贴吸光度。": "Enter at least two valid standard points before pasting readings.",
    "按浓度识别每一行": "rows identified by concentration",
    "每列一个标准浓度": "one concentration per column",
    "每行一个标准浓度": "one concentration per row",
    "上下同列配对，按组从左至右编号": "vertical replicates paired by column, grouped left to right",
    "单行按复孔数分组": "single row grouped by replicate count",
    "按表头识别，每行一个样品": "header identified; one sample per row",
    "每行一个样品": "one sample per row",
    "线性回归": "Linear regression",
    "逐点插值": "Point-to-point interpolation",
    "标准点内": "Within standards",
    "曲线未通过": "Curve failed QC",
    "R² 不适用": "R² not applicable",
    "曲线不可反算": "Cannot invert curve",
    "曲线无实数解": "No real solution",
    "负值估算": "Negative estimate",
    "外推多解": "Extrapolated; multiple roots",
    "外推估算": "Extrapolated estimate",
    "低点多解": "Below lowest standard; multiple roots",
    "低点估算": "Below lowest nonzero standard",
    "输入已扣空白": "Input already blank-corrected",
    "不适用": "Not applicable",
    "通过": "Pass",
    "未通过": "Fail",
    "自定义": "Custom",
    "厂商预设及本次标准点覆盖范围不等于本实验已验证的定量范围；请核对实际操作条件。": "A manufacturer's preset or the measured standard range is not necessarily this experiment's validated quantification range. Check the actual conditions.",
    "逐点插值没有整体 R²，或回归自由度不足；不可用 R² 判定曲线质量。": "Point-to-point interpolation has no overall R², or the regression has insufficient residual degrees of freedom. R² cannot be used for curve QC.",
    "R² 未达到设置门槛；当前选择为显示结果并提醒。": "R² did not meet the threshold; the selected policy displays results with a warning.",
    "部分相邻标准点的复孔均值没有随浓度上升，请检查标准品数据。": "Some adjacent standard means do not increase with concentration. Check the standards.",
    "拟合曲线在标准点区间内不是持续上升，无法可靠反算。": "The fitted curve is not consistently increasing across the standards and cannot be reliably inverted.",
    "最高标准点的吸光度未高于最低标准点，未报告浓度。": "The highest standard has no greater absorbance than the lowest standard; concentrations are not reported.",
    "部分样品只有单孔，无法评估复孔一致性。": "Some samples have only one well, so replicate consistency cannot be assessed.",
    "部分样品实际复孔数与统一设置不同，已按表头中实际提供的读数取平均。": "Some samples have a different replicate count from the common setting; the nonempty readings provided in the table were averaged.",
    "部分结果根据方程外推得到；R² 只反映标准点拟合，建议稀释后复测以验证。": "Some results are extrapolated. R² describes fit to the standard points only; verify extrapolated results by diluting and retesting.",
    "部分样品低于最低非零标准点，低点结果需验证。": "Some samples are below the lowest nonzero standard; validate low-end results.",
    "二次曲线存在多个非负解；显示与标准点上升段相连的解。": "The quadratic curve has multiple nonnegative roots; the result connected to the increasing standard range is shown.",
    "部分吸光度与所选曲线没有实数交点，无法计算。": "Some absorbances have no real intersection with the selected curve and cannot be calculated.",
    "负值只是低信号下的数学结果，不表示真实蛋白浓度为负。": "A negative estimate is a mathematical result at low signal; it is not a negative protein concentration.",
    "演示数据为虚构示例，不可作为实际实验结果。": "Demo data are fictional and must not be used as experimental results.",

    "表格中有未闭合的英文双引号，请检查粘贴内容。": "The table contains an unclosed double quote. Check the pasted content.",
    "标准浓度必须是大于或等于 0 的数字。": "Standard concentrations must be nonnegative numbers.",
    "请输入 2–96 个标准浓度，并以逗号、空格或换行分隔。": "Enter 2–96 standard concentrations separated by commas, spaces, or line breaks.",
    "标准浓度中有重复值；同一浓度的复孔应放在相同标准点下。": "Standard concentrations must be unique; put replicate wells under the same standard point.",
    "选择原始读数扣空白时，标准梯度必须包含 0 浓度。": "Raw readings require a zero-concentration blank in the standard series.",
    "请粘贴标准品的吸光度表格。": "Paste the standard absorbance table.",
    "带浓度的表格必须包含所有已设置的标准点。": "A table with concentrations must contain every configured standard point.",
    "上下复孔表格的行数应为复孔数的整数倍，请检查是否漏选。": "The number of rows in the vertical replicate table must be a multiple of the replicate count.",
    "上下复孔表格的行数不完整，且首行也是数字，请检查是否漏选复孔。": "The vertical replicate rows are incomplete and the first row is numeric. Check for missing wells.",
    "请粘贴样品吸光度。": "Paste the sample absorbance values.",
    "请检查样品数据。": "Check the sample data.",
    "样品名称数量与复孔列数不一致。": "The number of sample names does not match the number of replicate columns.",
    "未识别到样品读数。": "No sample readings were found.",
    "请粘贴至少一个样品的吸光度。": "Paste absorbance values for at least one sample.",
    "样品表格只有表头，没有读数。": "The sample table contains a header but no readings.",
    "标准数据无法拟合所选曲线，请检查输入。": "The standard data cannot be fitted to the selected curve. Check the inputs.",
    "所选拟合方法所需的不同标准点数不足。": "There are too few distinct standard points for the selected fitting method.",
    "标准品吸光度无法形成有效曲线，请检查标准品数据。": "The standard absorbances do not form a valid curve. Check the standard data.",
    "样品实际加入体积不能大于补液后总体积。": "The added sample volume cannot exceed the total volume after top-up.",
    "标准品和样品加工作液前的总体积不同；请核对实验方案，使两者反应条件可比较。": "Standards and samples have different total volumes before reagent addition. Check the protocol so reaction conditions are comparable.",
    "R² 门槛必须大于或等于 0 且小于 1。": "The R² threshold must be at least 0 and less than 1.",
    "标准梯度需要至少一个非零浓度。": "The standard series must include at least one nonzero concentration.",
    "计算失败，请检查输入。": "Calculation failed. Check the inputs.",
    "浏览器无法保存本机方案；请检查本地存储设置。": "The browser could not save the protocol. Check local storage settings.",
    "无法识别所选方案。": "The selected protocol could not be identified.",
    "请检查浓度和体积。": "Check concentrations and volumes.",
    "文件读取失败，请将 CSV 或 TSV 内容直接粘贴到输入框。": "The file could not be read. Paste CSV or TSV contents directly instead.",
    "备份文件中的设置格式不正确。": "The backup contains invalid settings.",
    "备份中的 R² 门槛不正确。": "The R² threshold in the backup is invalid.",
    "旧版方案无法自动转换，请核对条件并重新粘贴数据。": "This older protocol could not be converted automatically. Check the settings and paste the data again.",
    "旧版包含六点示例以外的标准；请使用自定义梯度粘贴。": "The older backup includes standards outside the six-point example. Paste them with a custom standard series.",
    "旧版标准吸光度无效。": "The older backup contains invalid standard absorbance values.",
    "旧版标准复孔数与两孔不一致，请核对后粘贴。": "The older backup does not contain two replicates per standard. Check it before pasting.",
    "无法识别数据备份。": "The data backup format could not be recognized.",
    "无法识别数据备份格式。": "The data backup format could not be recognized.",
    "请先输入常用方案名称。": "Enter a name for the protocol first.",
    "常用方案已保存到本浏览器，不包含吸光度和样品名称。": "The protocol was saved in this browser without absorbance values or sample names.",
    "无法保存方案。": "The protocol could not be saved.",
    "已删除本浏览器中的该方案。": "The saved protocol was deleted from this browser.",
    "无法删除方案。": "The saved protocol could not be deleted.",
    "已恢复数据备份；请核对标准梯度与复孔配对。": "The data backup was restored. Check the standards and replicate pairing.",
    "已导入旧版六点备份；请核对标准梯度、体积和复孔配对。": "An older six-point backup was imported. Check standards, volumes, and replicate pairing.",
    "无法载入数据备份。": "The data backup could not be loaded.",
    "标准品加工作液前总体积": "Standard volume before BCA reagent",
    "标准品复孔数": "Standard replicate count",
    "样品复孔数": "Sample replicate count",
    "实际样品体积": "Sample volume added",
    "样品补液后总体积": "Sample volume after top-up",
    "每孔 BCA 工作液体积": "BCA working reagent volume per well",
    "样品体积": "Sample volume",
    "样品补液后体积": "Sample volume after top-up",
    "工作液体积": "Working reagent volume",
    "统一设置": "The common setting",

    "复孔CV(%)": "Replicate CV (%)",
    "空白处理后吸光度": "Processed absorbance",
    "孔外预稀释倍数": "Pre-dilution factor",
    "孔内补液换算倍数": "Well top-up factor",
    "补液后反应前浓度(mg/mL)": "Pre-reagent concentration (mg/mL)",
    "原样浓度(mg/mL)": "Original concentration (mg/mL)",
    "原样浓度(µg/mL)": "Original concentration (µg/mL)",
    "空白均值": "Blank mean",
    "标准浓度(mg/mL)": "Standard concentrations (mg/mL)",
    "标准品复孔吸光度": "Standard replicate absorbances",
    "拟合方法": "Fitting method",
    "曲线表达式(x为mg/mL)": "Curve equation (x in mg/mL)",
    "R²质控门槛": "R² QC threshold",
    "R²判定": "R² result",
    "未达标策略": "QC policy",
    "标准总体积(µL)": "Standard total volume (µL)",
    "样品实际体积(µL)": "Sample volume added (µL)",
    "样品补液后体积(µL)": "Sample total volume after top-up (µL)",
    "工作液体积(µL)": "Working reagent volume (µL)",
    "试剂盒或本机方案": "Kit or saved protocol",
    "来源说明书": "Source instructions",
    "实验提示": "Experiment note",
    "演示数据": "Demo data",
    "预设示例应按实际实验核对；外推结果需验证": "Verify presets against the actual experiment; validate extrapolated results",
    "虚构演示数据": "Fictional demo data"
  };

  var language = 'en';
  var stored = null;
  try { stored = localStorage.getItem('bca-platform-language-v1'); } catch (_) {}
  if (stored === 'zh') language = 'zh';
  var staticNodes = [];
  var attributes = [];
  var walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    var node = walker.currentNode, parent = node.parentElement;
    if (!parent || parent.closest('[data-i18n-ignore]') || /^(SCRIPT|STYLE|TEXTAREA)$/.test(parent.tagName)) continue;
    if (/[\u4e00-\u9fff]/.test(node.nodeValue)) staticNodes.push({ node: node, value: node.nodeValue });
  }
  document.querySelectorAll('[placeholder], [aria-label], meta[name="description"]').forEach(function (el) {
    if (el.closest('[data-i18n-ignore]')) return;
    ['placeholder', 'aria-label', 'content'].forEach(function (name) {
      var value = el.getAttribute(name);
      if (value && /[\u4e00-\u9fff]/.test(value)) attributes.push({ element: el, name: name, value: value });
    });
  });

  function tr(value) {
    if (language === 'zh' || value === null || value === undefined) return value;
    var s = String(value), m;
    if (Object.prototype.hasOwnProperty.call(english, s)) return english[s];
    if ((m = s.match(/^(.+)必须是大于 0 的数字。$/))) return tr(m[1]) + ' must be a number greater than 0.';
    if ((m = s.match(/^(.+)必须为 1–8 的整数。$/))) return tr(m[1]) + ' must be an integer from 1 to 8.';
    if ((m = s.match(/^(.+)的预稀释倍数必须是大于或等于 1 的数字；未稀释请填 1。$/))) return tr(m[1]) + ': pre-dilution must be at least 1; enter 1 for an undiluted sample.';
    if ((m = s.match(/^样品数据第 (\d+) 行$/))) return 'Sample data row ' + m[1];
    if ((m = s.match(/^标准品浓度 (.+) 出现重复，请每个标准点只提供一行。$/))) return 'Standard concentration ' + m[1] + ' is duplicated; provide one row per standard point.';
    if ((m = s.match(/^标准浓度 (.+) 的复孔读数不完整或不是数字。$/))) return 'Replicate readings for standard concentration ' + m[1] + ' are missing or nonnumeric.';
    if ((m = s.match(/^无法识别标准品表格。当前设置为 (\d+) 个标准点、每点 (\d+) 孔；请检查表格方向、孔数和缺失值。$/))) return 'The standard table could not be recognized. Current settings: ' + m[1] + ' standard points with ' + m[2] + ' wells each. Check the table orientation, replicate count, and missing values.';
    if ((m = s.match(/^样品第 (\d+) 行开始的复孔组没有读数。$/))) return 'The replicate group beginning at sample row ' + m[1] + ' has no readings.';
    if ((m = s.match(/^样品第 (\d+) 行开始的复孔组、第 (\d+) 列存在缺孔，请核对。$/))) return 'The replicate group beginning at sample row ' + m[1] + ', column ' + m[2] + ' has a missing well.';
    if ((m = s.match(/^样品第 (\d+) 行开始的复孔组、第 (\d+) 列包含非数字读数。$/))) return 'The replicate group beginning at sample row ' + m[1] + ', column ' + m[2] + ' contains a nonnumeric reading.';
    if ((m = s.match(/^样品数据第 (\d+) 行格式不明确。请按设置的复孔数输入；如含样品编号或稀释倍数请提供表头。$/))) return 'Sample data row ' + m[1] + ' is ambiguous. Match the replicate count; add a header for names or dilution factors.';
    if ((m = s.match(/^样品数据第 (\d+) 行缺少有效吸光度，请核对复孔。$/))) return 'Sample data row ' + m[1] + ' has no valid absorbance. Check the replicates.';
    if ((m = s.match(/^样品“(.*)”浓度超出计算范围，请检查稀释倍数。$/))) return 'The concentration for sample “' + m[1] + '” exceeds the computational range. Check the dilution factor.';
    if (s.indexOf('无法换算标准单位：') === 0) return 'Cannot convert standard units: ' + tr(s.slice('无法换算标准单位：'.length));
    return s;
  }
  function setLanguage(next) {
    language = next === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    staticNodes.forEach(function (item) {
      var raw = item.value, key = raw.trim();
      item.node.nodeValue = language === 'zh' ? raw : raw.replace(key, tr(key));
    });
    attributes.forEach(function (item) { item.element.setAttribute(item.name, language === 'zh' ? item.value : tr(item.value)); });
    document.getElementById('language-switch').value = language;
    try { localStorage.setItem('bca-platform-language-v1', language); } catch (_) {}
  }
  window.BCA_I18N = { text: tr, language: function () { return language; }, setLanguage: setLanguage };
  document.getElementById('language-switch').addEventListener('change', function (event) {
    setLanguage(event.target.value);
    document.dispatchEvent(new CustomEvent('bca-languagechange'));
  });
  setLanguage(language);
}());
