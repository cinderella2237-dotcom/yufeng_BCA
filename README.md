# BCA Protein Quantification Platform

An open-source, browser-based calculator for BCA protein assays. Choose a kit example or define your own standard concentrations, paste standard and sample absorbances, and review the resulting standard curve and protein concentrations. The interface defaults to English and can be switched to Chinese.

Project attribution: **Cinderella_yufeng**. Copyright © 2026 Cinderella_yufeng. AI-assisted tools were used during the design and development of this project.

The calculator runs locally in your browser and does not require an account or a server for calculations. It was developed for research and teaching and has not been validated for clinical diagnosis. Presets are editable examples, not a substitute for checking the actual kit instructions and laboratory protocol.

## Quick start

1. Open `index.html` in a current desktop browser. Select a kit example, or choose **Other kit / fully custom**. The default laboratory example uses 0, 0.125, 0.25, 0.5, 1, and 2 mg/mL standards with 12.5 µL of sample or standard plus 100 µL of working reagent per well.
2. Check the standard concentrations, units, replicate counts, volumes, fitting method, and quality-control settings against your experiment. You can paste concentrations as a row or column.
3. Paste the standard and sample absorbance values into their respective boxes. By default, each column is one standard or sample, and replicates are arranged vertically. Consecutive row groups are supported. Review the pairing preview before calculating.
4. Select **Calculate concentrations**, review the curve and warnings, and download the results as CSV. A data backup can also be downloaded and later restored through **Import data backup**.

For example, the following is a sample table with three samples, each measured in two vertically adjacent wells:

```text
0.539    0.232    0.390
0.541    0.235    0.392
```

For different sample dilution factors, choose the one-sample-per-row layout and include a header:

```text
Sample Name,Absorbance 1,Absorbance 2,Dilution
Sample A,0.539,0.541,2
Sample B,0.232,0.235,4
```

CSV and TSV files can be imported directly. For Excel workbooks, copy the relevant cells or export them as CSV. Both English and Chinese column headers are recognized, independently of the interface language. Changing languages does not clear the current inputs or results.

**Save in this browser** stores only protocol settings, not sample names or absorbances. Your language preference is also stored locally. If you want to restore a calculation after leaving the page, explicitly download a data backup and keep it somewhere appropriate.

## Calculations and interpretation

- By default, replicate readings are averaged and both standards and samples are corrected using the mean of the zero-concentration blank. If the instrument already subtracted the blank, select the already-corrected option.
- Linear regression, quadratic regression, and point-to-point linear interpolation are available. The default rule is **R² strictly greater than 0.99**; this is an adjustable laboratory rule, not a universal manufacturer requirement. Point-to-point interpolation has no overall R². R² is also not used for QC when a regression has no residual degrees of freedom.
- The highest standard point is not a cap on the original sample concentration. A result outside the measured standard points is reported numerically and marked as an extrapolated estimate. A high R² does not validate extrapolation; dilution and retesting or other method validation is recommended.
- Original concentration = pre-reagent sample concentration × (total volume after top-up ÷ sample volume added) × pre-dilution factor. The BCA working reagent is not included in the sample top-up factor. Standards and samples must have matching total volumes before reagent addition.
- Replicate CV is calculated from replicate standard deviation divided by the processed mean absorbance. It is not shown for a single well or a nonpositive mean. No universal pass threshold is imposed.
- Check sample matrix compatibility, reducing agents, chelators, incubation conditions, wavelength, and the specific manufacturer's instructions. Kit performance claims are not the same as the standard points actually measured in a given experiment.

## Included protocol examples

All examples include a blank. Check the actual kit number, instructions, and standards prepared for the experiment.

| Example | Standard points | Source |
| --- | --- | --- |
| Thermo Pierce BCA 23225/23227 | 0, 0.025, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 2 mg/mL | [MAN0011430 Rev. D](https://tools.thermofisher.com/content/sfs/manuals/MAN0011430_Pierce_BCA_Protein_Asy_UG.pdf), standard microplate protocol |
| Beyotime P0012 | 0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5 mg/mL | [P0012 instructions](https://www.beyotime.com/Manual/P0012%20BCA%E8%9B%8B%E7%99%BD%E6%B5%93%E5%BA%A6%E6%B5%8B%E5%AE%9A%E8%AF%95%E5%89%82%E7%9B%92.pdf) |
| Beyotime P0010S | 0, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5 mg/mL | [P0010S instructions](https://m.beyotime.com/Manual/P0010S%20BCA%E8%9B%8B%E7%99%BD%E6%B5%93%E5%BA%A6%E6%B5%8B%E5%AE%9A%E8%AF%95%E5%89%82%E7%9B%92_%E5%A2%9E%E5%BC%BA%E5%9E%8B_.pdf) |
| Solarbio PC0020 | 0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5 mg/mL | [PC0020 V02 instructions](https://www.solarbio.com/images/202507/1752228854113948235.pdf) |
| Vazyme E112 V22.1 | 0, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1 mg/mL | [Manufacturer's manual, distributor mirror](https://www.biorbyt.com/images/pub/media/additional_documents/New_site/Manual/vazyme/E112-01.pdf?timestamp=20260128); converted from mass per well using 20 µL |
| Thermo Micro BCA 23235 | 0, 2.5, 5, 10, 20, 40 µg/mL | Example subset selected from the [MAN0011237 manual](https://documents.thermofisher.com/TFS-Assets%2FLSG%2Fmanuals%2FMAN0011237_Micro_BCA_Protein_Asy_UG.pdf); verify the actual series used |

## GitHub Pages

The project is a static website and does not require a build step.

1. Extract the release archive. Upload the **contents** of the extracted folder to the repository root, rather than uploading the outer folder. The root should directly contain `index.html`, `styles.css`, `i18n.js`, `kits.js`, `app.js`, `README.md`, `LICENSE`, and `CITATION.cff`; the `tests` folder and project configuration files can be included alongside them. If the repository already contains an AGPL-3.0 license, review the existing file before replacing it.
2. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select the branch containing the files (usually `main`) and `/(root)`, then save.
3. Wait for the deployment and use the URL shown in Pages settings. See the [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Privacy and publication

The page does not transmit sample names or absorbances to an application server and does not include analytics. Saved protocols and the language choice are stored in the current browser; raw data and results are downloaded only when requested. Hosting providers may record connection information, and opening a source manual visits an external website.

Do not commit raw experimental data, downloaded backups, credentials, or private information to a public repository. The `.gitignore` excludes common data and credential files but does not prevent manual uploads or remove already tracked files. The six-point laboratory example and its 12.5 µL + 100 µL protocol are part of the public source; remove or change them before publication if they are confidential.

## License and citation

Project software is licensed under **GNU Affero General Public License v3.0 only**; see [LICENSE](LICENSE). Use, modification, distribution, and commercial use are allowed under its terms. Distribution and qualifying network use of modified versions carry applicable source and notice obligations. An alternative authorization may be discussed separately when necessary and when the relevant rights are available; the existing AGPL permissions remain unaffected.

Kit trademarks, third-party manuals, and users' experimental data are not automatically licensed under the project's software license. Please cite the project using [CITATION.cff](CITATION.cff). A verified repository URL or DOI may be added to the citation file after publication; citation metadata is not proof of copyright registration.

## Development tests

The test suite uses fictional data and covers standard calculations, units, blank correction, quality control, extrapolation, backup compatibility, English/Chinese switching, and layout. Running the website itself does not require these dependencies.

```sh
npm install
npx playwright install chromium
npm test
```

Suggestions for corrections or additional kits are welcome through project issues. Please do not post private data or credentials in public issues. The project is not affiliated with any kit manufacturer.
