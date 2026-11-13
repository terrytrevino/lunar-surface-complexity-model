# Lunar Surface Complexity Model v0.8 research draft

The architecture workspace adds traceable Connolly source material and editable surface-planning calculations to the existing complexity testbed. Open **architecture.html** for the new working model, or **index.html** for the model home and preserved v0.7 workbook explorer. Both work locally without a build step.

## Source library

The local package includes six complete original PDFs totaling 351 pages: the 2004 and 2012 architecture decks, the 2019 After LM catalog, the 2021 HLS deck, and two 2023 Connolly and Carrier geotechnical publications. The searchable library records source URLs, publication dates, interpretation limits, page counts and SHA-256 hashes. Original NASA and third-party credits remain in the PDFs. The hosted review uses original-source links; offline PDF links appear when opened as a local file.

Eight source records include those six publications plus the versioned Space 4 All v6.2 power allocation and VECTOR apparatus baseline. **architecture-data.json** is the canonical evidence dataset. The same JSON is embedded in architecture.html for offline use; a verification test checks that they match. No native PPTX or exact live LSSW workshop deck has been verified.

## Model changes

* Editable quantities, unit masses, demand, deployment hours, stowed volume and phase allocation for 12 historical inventory types. Blank values remain unknown; quantities of zero remove an item from active budget completeness checks.
* Cumulative phase allocations and explicit open mass, time and volume budgets. Packing, adapters, margin and per-lander assignment remain separate work.
* Power and storage calculations with separate stationary and mobile energy, solar availability, derating, distribution efficiency, outage duration and optional incremental VECTOR demand.
* A choice between a total customer allocation and a sum of item demands, preventing silent double counting.
* Excavation mass from a depth-dependent density reference, with an optional explicit energy factor and swell assumption.
* Proposed dependency graph and downstream blocking, with crew admission independent of VECTOR research readiness.
* Editable evidence records for all 28 existing complexity parameters, with source mapping and interpretation limits.
* Validated scenario import, portable JSON export, cargo and parameter CSV exports, evidence JSON download, and explicit browser save/load.

## Evidence boundaries

Connolly's 2012 GER case is a historical four-person polar concept. The inventory has 29 noncrew item instances across 12 types; logistics payloads and carriers are not automatically distinct active systems, and their contents may overlap. The page 20 capacities give three 2 kW/100 kWh PUPs and two 200 kWh SEVs. The 38,000 kg result from 4×8 t + 6×1 t is a nominal historical cargo-capacity envelope, not delivered mass or packing feasibility.

The Space 4 All v6.2 nominal 12.5 kW allocation describes a six-person project. Comparing it with 6 kW historical solar nameplate is a scaling experiment across architectures, not proof that Connolly's mission was underpowered. VECTOR demand is unresolved until measurements or explicit assumptions are entered. No habitat-scale field, biological effect, radiation shielding, or life-support credit is inferred.

The v0.7 workbook snapshot, demonstration ranks and experimental adequacy ratios remain labeled as legacy. They have not been overwritten or silently recalculated. A new scenario Complexity Index is intentionally uncomputed: approved peers, consistent boundaries, comparable raw data and reviewed ranking rules are required. Source completeness does not establish confidence or success probability.

## Equations and units

Generation kW = PUP quantity × 2 kW × availability × derating.

Stationary nameplate energy kWh = PUP quantity × 100 kWh. Mobile nameplate energy kWh = SEV quantity × 200 kWh; this is excluded from stationary supply.

Usable stationary energy kWh = nameplate × depth of discharge × discharge efficiency.

Distribution input demand kW = customer demand / distribution efficiency. Customer demand is either a project total allocation or the complete sum of inventory unit demands, plus an enabled, sized VECTOR increment. An enabled but unknown increment propagates an unknown result.

Zero-generation endurance h = usable energy / distribution input demand. Battery nameplate required for an outage = distribution input demand × outage hours / (depth of discharge × discharge efficiency). These are steady-load estimates; the model does not simulate illumination chronology, recharge, temperature, aging or contingency reserves.

[Connolly and Carrier's engineering guide](https://ntrs.nasa.gov/citations/20220014634), PDF page 2 equation 1, gives ρ = 1.92(z + 12.2)/(z + 18) g/cm³ with z in cm. In metres, the density function is 1920(z + 0.122)/(z + 0.18) kg/m³. For a vertical-sided excavation of length L, width W and depth d, integrating the density gives:

Mass kg = L W × 1920 × [d − 0.058 ln((d + 0.18)/0.18)].

The workspace restricts depth to 0–1 m as a conservative analysis range for this reference exercise. Dimensions and default swell factor 1.2 are illustrative assumptions. Excavation electrical energy remains unknown until an explicit kWh/kg factor is supplied. It is reported as energy rather than silently converted into continuous power. The calculation is not a digging-force, bearing-capacity, slope-stability or site-specific polar soil model.

[The LPSC 2023 abstract](https://ntrs.nasa.gov/citations/20220018853) describes a nonlinear Winkler model with n = 1.86 and k = 163 Pa/mm^1.86 for its plate formulation. The workspace records this as evidence, not a universal foundation parameter. Its revised shear behavior must not be mixed silently with the guide's earlier linear descriptions. The abstract's citation year for the guide differs from the NTRS publication record; the library uses the NTRS March 2023 publication date.

## Reproducibility and validation

Run `node test-architecture.cjs` from this directory. Checks cover energy conservation, mobile reserve isolation, unknown propagation, exclusive demand boundaries, mass closure, phase allocation, numerical integration of excavation mass, dependency cycles, VECTOR and crew-gate separation, invalid imports and canonical-data consistency.

Browser review covers desktop and mobile layouts, source search, inventory edits, power propagation, scenario save/load, dependency blocking, parameter filters, rejected imports and downloads. The source PDFs and local package have file hashes for audit.

This update is prepared against repository commit **0f11085fae6aa40040eabc9548de45c7c3a64e23**. The separately maintained native complexity workbook has not been edited. The v0.8 web scenario is its own research layer, not a claim that a new workbook has been recalculated.

## Next model closure work

Close cargo masses and packaging, per-flight allocation, offload tooling and bootstrap power; measure VECTOR electrical and thermal demand; obtain time-resolved site illumination and load profiles; and define a reviewed peer cohort before assigning new normalized complexity scores. Historical concepts remain distinct from current Artemis requirements. This is a research discussion draft, not an AIAA standard or NASA endorsement.