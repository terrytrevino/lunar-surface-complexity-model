# Lunar Surface Complexity Model

Public technical review site for the AIAA Space & Missiles Group Lunar Surface Complexity Model working testbed.

## What this repository contains

- `index.html` — complete self-contained public review site: structure, styling, lunar SVG schematic, current v0.7 CLEAN model values, filtering, stress scenarios, and interaction logic
- `README.md` — scope, disclaimer, and review notes

## Model scope

The site presents a working Lunar Surface implementation of the committee complexity framework. The current pilot uses 28 proposed Lunar Surface parameters across Structural, Functional, Technology, Environment, Performance, Logistics, and Programmatic families. The resource-adequacy and stress layers are experimental and remain separate from the core complexity index pending historical calibration.

The full Excel workbook is maintained separately and is linked from the site through OneDrive so the web code remains easy to inspect and review.

## Research status / disclaimer

Working technical discussion draft for review and critique. This is not an AIAA standard, recommended practice, or official AIAA position, and it is not a NASA product or endorsement. The Lunar Surface parameter set and resource/stress overlays are working research constructs subject to revision, peer review, provenance checks, and calibration against real mission outcomes.

## Code review

The published site is intentionally simple and self-contained in `index.html`: HTML, CSS, SVG, model data, and JavaScript are all visible in one file. There is no framework or build step, so reviewers can inspect exactly how each displayed value is rendered.

No open-source license has been assigned at this stage; the repository is published for technical review and collaboration.