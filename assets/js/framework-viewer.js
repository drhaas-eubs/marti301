/* ============================================================
   MARTI301 · Framework Sheet Viewer
   Protected PDF rendering with page-anchored navigation
   © 2026 Dr. Hildegard Haas · EU Business School

   Usage:
     1. Load PDF.js (CDN) and this file on every unit page.
     2. Call FW.openPage(N) to open the modal at page N.
     3. Add data-fw-slug="..." to any thumbnail to make it clickable.
     4. The pill button uses class "fw-viewer-pill" + data-fw-slug
        or data-fw-page.
   ============================================================ */
(function () {
  'use strict';

  /* ----- Configuration ---------------------------------------- */
  const PDF_PATH = 'assets/pdf/framework-library.pdf';
  const PDFJS_VERSION = '3.11.174';
  const PDFJS_LIB = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
  const PDFJS_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

  /* ----- Page anchor mapping ---------------------------------- */
  /* Page formula: page = 8 + 5*(slibrary-1) + sheet
     (Cover=1, Master Index pp.2-7, "How to Use" p.8, sheets start p.9) */
  const FRAMEWORKS = [
    /* ===== UNIT 1 · AI Strategy & Governance ===== */
    /* Slibrary 1 · Strategic AI Framing */
    { slug: 'eu-ai-act-pyramid',           name: 'EU AI Act Risk Pyramid',          unit: 1, slibrary: 1, sheet: 1 },
    { slug: 'nist-rmf',                    name: 'NIST AI RMF Lifecycle Wheel',     unit: 1, slibrary: 1, sheet: 2 },
    { slug: 'perez-s-curve',               name: 'Perez Techno-Economic S-Curve',   unit: 1, slibrary: 1, sheet: 3 },
    { slug: 'ai-maturity-staircase',       name: 'AI Maturity Staircase',           unit: 1, slibrary: 1, sheet: 4 },
    { slug: 'mckinsey-high-performers',    name: 'McKinsey AI High Performers',     unit: 1, slibrary: 1, sheet: 5 },
    /* Slibrary 2 · Competitive Advantage */
    { slug: 'porter-five-forces',          name: "Porter's Five Forces",            unit: 1, slibrary: 2, sheet: 1 },
    { slug: 'vrio-framework',              name: 'VRIO Framework',                  unit: 1, slibrary: 2, sheet: 2 },
    { slug: 'porter-value-chain',          name: "Porter's Value Chain",            unit: 1, slibrary: 2, sheet: 3 },
    { slug: 'rbv-dynamic-capabilities',    name: 'RBV · Dynamic Capabilities',      unit: 1, slibrary: 2, sheet: 4 },
    { slug: 'disruption-s-curves',         name: 'Disruption S-Curves',             unit: 1, slibrary: 2, sheet: 5 },
    /* Slibrary 3 · AI Programme Discipline */
    { slug: 'crisp-dm',                    name: 'CRISP-DM Cycle',                  unit: 1, slibrary: 3, sheet: 1 },
    { slug: 'dded-funnel',                 name: 'DDED Funnel',                     unit: 1, slibrary: 3, sheet: 2 },
    { slug: 'build-buy-borrow',            name: 'Build-Buy-Borrow',                unit: 1, slibrary: 3, sheet: 3 },
    { slug: 'ai-project-failure-funnel',   name: 'AI Project Failure Funnel',       unit: 1, slibrary: 3, sheet: 4 },
    { slug: 'data-readiness',              name: 'Data Readiness',                  unit: 1, slibrary: 3, sheet: 5 },
    /* Slibrary 4 · Prediction & Judgment */
    { slug: 'prediction-judgment',         name: 'Prediction-Judgment Split',       unit: 1, slibrary: 4, sheet: 1 },
    { slug: 'centaur-model',               name: 'Centaur Model',                   unit: 1, slibrary: 4, sheet: 2 },
    { slug: 'automation-augmentation',     name: 'Automation-Augmentation Spectrum',unit: 1, slibrary: 4, sheet: 3 },
    { slug: 'bcg-people-pillar',           name: 'BCG People Pillar',               unit: 1, slibrary: 4, sheet: 4 },
    { slug: 'human-in-the-loop',           name: 'Human-in-the-Loop',               unit: 1, slibrary: 4, sheet: 5 },

    /* ===== UNIT 2 · ML & Data-Driven Decisions ===== */
    /* Slibrary 5 · ML Foundations */
    { slug: 'three-ml-paradigms',          name: 'Three ML Paradigms',              unit: 2, slibrary: 5, sheet: 1 },
    { slug: 'bias-variance',               name: 'Bias-Variance Tradeoff',          unit: 2, slibrary: 5, sheet: 2 },
    { slug: 'train-val-test',              name: 'Train-Val-Test Split',            unit: 2, slibrary: 5, sheet: 3 },
    { slug: 'rule-based-vs-ml',            name: 'Rule-Based vs ML',                unit: 2, slibrary: 5, sheet: 4 },
    { slug: 'accuracy-interpretability',   name: 'Accuracy-Interpretability',       unit: 2, slibrary: 5, sheet: 5 },
    /* Slibrary 6 · MLOps & Lifecycle */
    { slug: 'mlops-loop',                  name: 'MLOps Loop',                      unit: 2, slibrary: 6, sheet: 1 },
    { slug: 'cross-validation',            name: 'Cross-Validation',                unit: 2, slibrary: 6, sheet: 2 },
    { slug: 'model-selection',             name: 'Model Selection',                 unit: 2, slibrary: 6, sheet: 3 },
    { slug: 'ensemble-methods',            name: 'Ensemble Methods',                unit: 2, slibrary: 6, sheet: 4 },
    { slug: 'deployment-patterns',         name: 'Deployment Patterns',             unit: 2, slibrary: 6, sheet: 5 },
    /* Slibrary 7 · Data as an Asset */
    { slug: 'data-value-chain',            name: 'Data Value Chain',                unit: 2, slibrary: 7, sheet: 1 },
    { slug: 'data-moat',                   name: 'Data Moat',                       unit: 2, slibrary: 7, sheet: 2 },
    { slug: 'first-vs-third-party-data',   name: '1st / 3rd-Party Data',            unit: 2, slibrary: 7, sheet: 3 },
    { slug: 'feature-engineering',         name: 'Feature Engineering',             unit: 2, slibrary: 7, sheet: 4 },
    { slug: 'data-network-effects',        name: 'Data Network Effects',            unit: 2, slibrary: 7, sheet: 5 },
    /* Slibrary 8 · Evaluation & Trust */
    { slug: 'confusion-matrix',            name: 'Confusion Matrix',                unit: 2, slibrary: 8, sheet: 1 },
    { slug: 'roc-auc',                     name: 'ROC / AUC',                       unit: 2, slibrary: 8, sheet: 2 },
    { slug: 'shap-values',                 name: 'SHAP Values',                     unit: 2, slibrary: 8, sheet: 3 },
    { slug: 'drift-monitoring',            name: 'Drift Monitoring',                unit: 2, slibrary: 8, sheet: 4 },
    { slug: 'fairness-metrics',            name: 'Fairness Metrics',                unit: 2, slibrary: 8, sheet: 5 },

    /* ===== UNIT 3 · Customer Experience & Marketing 6.0 ===== */
    /* Slibrary 9 · Marketing Evolution */
    { slug: 'marketing-evolution',         name: 'Marketing 1.0 → 6.0',             unit: 3, slibrary: 9, sheet: 1 },
    { slug: 'metaverse',                   name: 'Metaverse',                       unit: 3, slibrary: 9, sheet: 2 },
    { slug: 'phys-digital-convergence',    name: 'Physical-Digital Convergence',    unit: 3, slibrary: 9, sheet: 3 },
    { slug: 'generative-ai-in-marketing',  name: 'Generative AI in Marketing',      unit: 3, slibrary: 9, sheet: 4 },
    { slug: 'human-centric-marketing',     name: 'Human-Centric Marketing',         unit: 3, slibrary: 9, sheet: 5 },
    /* Slibrary 10 · Personalisation Engines */
    { slug: 'personalisation-maturity',    name: 'Personalisation Maturity',        unit: 3, slibrary: 10, sheet: 1 },
    { slug: 'recommendation-systems',      name: 'Recommendation Systems',          unit: 3, slibrary: 10, sheet: 2 },
    { slug: 'realtime-vs-batch',           name: 'Realtime vs Batch',               unit: 3, slibrary: 10, sheet: 3 },
    { slug: 'privacy-personalisation',     name: 'Privacy-Personalisation Trade-off', unit: 3, slibrary: 10, sheet: 4 },
    { slug: 'uplift-modelling',            name: 'Uplift Modelling',                unit: 3, slibrary: 10, sheet: 5 },
    /* Slibrary 11 · Customer Journey & AI */
    { slug: 'journey-map-ai',              name: 'Journey Map with AI',             unit: 3, slibrary: 11, sheet: 1 },
    { slug: 'next-best-action',            name: 'Next-Best-Action',                unit: 3, slibrary: 11, sheet: 2 },
    { slug: 'omnichannel',                 name: 'Omnichannel',                     unit: 3, slibrary: 11, sheet: 3 },
    { slug: 'sentiment-analysis',          name: 'Sentiment Analysis',              unit: 3, slibrary: 11, sheet: 4 },
    { slug: 'customer-lifetime-value',     name: 'Customer Lifetime Value',         unit: 3, slibrary: 11, sheet: 5 },
    /* Slibrary 12 · Trust & Brand */
    { slug: 'trust-framework',             name: 'Trust Framework',                 unit: 3, slibrary: 12, sheet: 1 },
    { slug: 'brand-personality',           name: 'Brand Personality',               unit: 3, slibrary: 12, sheet: 2 },
    { slug: 'chatbot-maturity',            name: 'Chatbot Maturity',                unit: 3, slibrary: 12, sheet: 3 },
    { slug: 'deepfake-risks',              name: 'Deepfake Risks',                  unit: 3, slibrary: 12, sheet: 4 },
    { slug: 'ai-driven-loyalty',           name: 'AI-Driven Loyalty',               unit: 3, slibrary: 12, sheet: 5 },

    /* ===== UNIT 4 · Financial Side of AI · Risk Management ===== */
    /* Slibrary 13 · Cost-Benefit Analysis */
    { slug: 'cost-benefit-waterfall',      name: 'Cost-Benefit Waterfall',          unit: 4, slibrary: 13, sheet: 1 },
    { slug: 'roi-payback',                 name: 'ROI Payback',                     unit: 4, slibrary: 13, sheet: 2 },
    { slug: 'four-value-drivers',          name: 'Four Value Drivers',              unit: 4, slibrary: 13, sheet: 3 },
    { slug: 'npv-formula',                 name: 'NPV Formula',                     unit: 4, slibrary: 13, sheet: 4 },
    { slug: 'cost-breakdown',              name: 'Cost Breakdown',                  unit: 4, slibrary: 13, sheet: 5 },
    /* Slibrary 14 · TCO Framework */
    { slug: 'tco-iceberg',                 name: 'TCO Iceberg',                     unit: 4, slibrary: 14, sheet: 1 },
    { slug: 'cloud-vs-onprem',             name: 'Cloud vs On-Prem',                unit: 4, slibrary: 14, sheet: 2 },
    { slug: 'gpu-cost-curve',              name: 'GPU / Compute Cost Curve',        unit: 4, slibrary: 14, sheet: 3 },
    { slug: 'hidden-cost-categories',      name: 'Hidden Cost Categories',          unit: 4, slibrary: 14, sheet: 4 },
    { slug: 'finops-loop',                 name: 'FinOps Loop',                     unit: 4, slibrary: 14, sheet: 5 },
    /* Slibrary 15 · AI Risk Management */
    { slug: 'ai-risk-taxonomy',            name: 'AI Risk Taxonomy',                unit: 4, slibrary: 15, sheet: 1 },
    { slug: 'sr-11-7-mrm',                 name: 'SR 11-7 Model Risk Mgmt',         unit: 4, slibrary: 15, sheet: 2 },
    { slug: 'risk-heatmap',                name: 'Risk Heatmap',                    unit: 4, slibrary: 15, sheet: 3 },
    { slug: 'three-lines-of-defence',      name: 'Three Lines of Defence',          unit: 4, slibrary: 15, sheet: 4 },
    { slug: 'ai-incident-response',        name: 'AI Incident Response',            unit: 4, slibrary: 15, sheet: 5 },
    /* Slibrary 16 · Responsible AI Scorecard */
    { slug: 'responsible-ai-radar',        name: 'Responsible AI Radar',            unit: 4, slibrary: 16, sheet: 1 },
    { slug: 'bias-audit-pipeline',         name: 'Bias Audit Pipeline',             unit: 4, slibrary: 16, sheet: 2 },
    { slug: 'rai-governance-maturity',     name: 'RAI Governance Maturity',         unit: 4, slibrary: 16, sheet: 3 },
    { slug: 'red-team-loop',               name: 'Red-Team Loop',                   unit: 4, slibrary: 16, sheet: 4 },
    { slug: 'board-oversight-chain',       name: 'Board Oversight Chain',           unit: 4, slibrary: 16, sheet: 5 },

    /* ===== UNIT 5 · IP & Value Creation through AI ===== */
    /* Slibrary 17 · Copyright & Authorship */
    { slug: 'copyright-ownership-tree',    name: 'Copyright Ownership Tree',        unit: 5, slibrary: 17, sheet: 1 },
    { slug: 'four-authorship-models',      name: 'Four Authorship Models',          unit: 5, slibrary: 17, sheet: 2 },
    { slug: 'getty-v-stability',           name: 'Getty v Stability',               unit: 5, slibrary: 17, sheet: 3 },
    { slug: 'training-data-provenance',    name: 'Training Data Provenance',        unit: 5, slibrary: 17, sheet: 4 },
    { slug: 'moral-rights',                name: 'Moral Rights',                    unit: 5, slibrary: 17, sheet: 5 },
    /* Slibrary 18 · AI Licensing Models */
    { slug: 'open-closed-spectrum',        name: 'Open-Closed Spectrum',            unit: 5, slibrary: 18, sheet: 1 },
    { slug: 'ai-licence-types',            name: 'AI Licence Types',                unit: 5, slibrary: 18, sheet: 2 },
    { slug: 'api-tiering',                 name: 'API Tiering',                     unit: 5, slibrary: 18, sheet: 3 },
    { slug: 'revenue-share-models',        name: 'Revenue Share Models',            unit: 5, slibrary: 18, sheet: 4 },
    { slug: 'ip-risk-allocation',          name: 'IP Risk Allocation',              unit: 5, slibrary: 18, sheet: 5 },
    /* Slibrary 19 · Data IP Protection */
    { slug: 'data-rights-stack',           name: 'Data Rights Stack',               unit: 5, slibrary: 19, sheet: 1 },
    { slug: 'trade-secret-vs-patent',      name: 'Trade Secret vs Patent vs Copyright', unit: 5, slibrary: 19, sheet: 2 },
    { slug: 'eu-database-right',           name: 'EU Database Right',               unit: 5, slibrary: 19, sheet: 3 },
    { slug: 'data-licensing-taxonomy',     name: 'Data Licensing Taxonomy',         unit: 5, slibrary: 19, sheet: 4 },
    { slug: 'defensive-moats',             name: 'Defensive Moats',                 unit: 5, slibrary: 19, sheet: 5 },
    /* Slibrary 20 · AI Monetisation Models */
    { slug: 'monetisation-canvas',         name: 'Monetisation Canvas',             unit: 5, slibrary: 20, sheet: 1 },
    { slug: 'ai-pricing-models',           name: 'AI Pricing Models',               unit: 5, slibrary: 20, sheet: 2 },
    { slug: 'platform-vs-product',         name: 'Platform vs Product',             unit: 5, slibrary: 20, sheet: 3 },
    { slug: 'ecosystem-capture-map',       name: 'Ecosystem Capture Map',           unit: 5, slibrary: 20, sheet: 4 },
    { slug: 'value-capture-curve',         name: 'Value Capture Curve',             unit: 5, slibrary: 20, sheet: 5 },

    /* ===== UNIT 6 · AI in Investment Management · Capstone ===== */
    /* Slibrary 21 · Algorithmic Trading & Quant */
    { slug: 'algo-trading-spectrum',       name: 'Algo Trading Spectrum',           unit: 6, slibrary: 21, sheet: 1 },
    { slug: 'portfolio-ai-stack',          name: 'Portfolio AI Stack',              unit: 6, slibrary: 21, sheet: 2 },
    { slug: 'factor-zoo',                  name: 'Factor Zoo',                      unit: 6, slibrary: 21, sheet: 3 },
    { slug: 'risk-analytics-var',          name: 'Risk Analytics · VaR',            unit: 6, slibrary: 21, sheet: 4 },
    { slug: 'investment-ai-maturity',      name: 'Investment AI Maturity',          unit: 6, slibrary: 21, sheet: 5 },
    /* Slibrary 22 · Investment Process & Aladdin */
    { slug: 'investment-process-cycle',    name: 'Investment Process Cycle',        unit: 6, slibrary: 22, sheet: 1 },
    { slug: 'blackrock-aladdin',           name: 'BlackRock Aladdin · Modules',     unit: 6, slibrary: 22, sheet: 2 },
    { slug: 'alternative-data',            name: 'Alternative Data',                unit: 6, slibrary: 22, sheet: 3 },
    { slug: 'backtesting-pipeline',        name: 'Backtesting Pipeline',            unit: 6, slibrary: 22, sheet: 4 },
    { slug: 'esg-ai-integration',          name: 'ESG + AI Integration',            unit: 6, slibrary: 22, sheet: 5 },
    /* Slibrary 23 · AI Adoption & Transformation */
    { slug: 'rogers-diffusion',            name: 'Rogers Diffusion',                unit: 6, slibrary: 23, sheet: 1 },
    { slug: 'pilot-to-scale',              name: 'Pilot-to-Scale',                  unit: 6, slibrary: 23, sheet: 2 },
    { slug: 'transformation-flywheel',     name: 'Transformation Flywheel',         unit: 6, slibrary: 23, sheet: 3 },
    { slug: 'talent-matrix',               name: 'Talent Matrix',                   unit: 6, slibrary: 23, sheet: 4 },
    { slug: 'ai-readiness-radar',          name: 'AI Readiness Radar',              unit: 6, slibrary: 23, sheet: 5 },
    /* Slibrary 24 · Capstone Integration */
    { slug: 'six-unit-integration',        name: 'Six-Unit Integration',            unit: 6, slibrary: 24, sheet: 1 },
    { slug: 'ai-strategy-canvas',          name: 'AI Strategy Canvas',              unit: 6, slibrary: 24, sheet: 2 },
    { slug: 'klarna-integrated-case',      name: 'Klarna Integrated Case',          unit: 6, slibrary: 24, sheet: 3 },
    { slug: 'practitioner-playbook',       name: 'Practitioner Playbook',           unit: 6, slibrary: 24, sheet: 4 },
    { slug: 'future-proof-leadership',     name: 'Future-Proof Leadership',         unit: 6, slibrary: 24, sheet: 5 }
  ];

  /* Compute page anchors */
  FRAMEWORKS.forEach(fw => {
    fw.page = 8 + 5 * (fw.slibrary - 1) + fw.sheet;
  });

  /* Build lookup map by slug */
  const SLUG_TO_FW = {};
  FRAMEWORKS.forEach(fw => { SLUG_TO_FW[fw.slug] = fw; });

  /* Unit overview pages: jump to that unit's first sheet */
  const UNIT_PAGES = { 1: 9, 2: 29, 3: 49, 4: 69, 5: 89, 6: 109 };

  /* ----- State ----------------------------------------------- */
  let pdfDoc = null;
  let currentPage = 1;
  let totalPages = 128;
  let isRendering = false;
  let pdfjsReady = null; /* Promise */

  /* ----- DOM injection --------------------------------------- */
  function buildModalDOM() {
    if (document.getElementById('fw-viewer-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'fw-viewer-overlay';
    overlay.className = 'fw-viewer-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'fw-viewer-title');
    overlay.innerHTML = `
      <div class="fw-viewer-modal" id="fw-viewer-modal">
        <header class="fw-viewer-header">
          <div style="min-width:0; flex:1;">
            <h2 class="fw-viewer-title" id="fw-viewer-title">Framework Sheet</h2>
            <span class="fw-viewer-title-meta" id="fw-viewer-meta">MARTI301 · Framework Library</span>
          </div>
          <div class="fw-viewer-controls">
            <button type="button" class="fw-btn" id="fw-btn-prev" aria-label="Previous sheet" title="Previous (←)">‹</button>
            <span class="fw-page-indicator" id="fw-page-indicator">– / –</span>
            <button type="button" class="fw-btn" id="fw-btn-next" aria-label="Next sheet" title="Next (→)">›</button>
            <button type="button" class="fw-btn" id="fw-btn-zoom-out" aria-label="Zoom out" title="Zoom out (−)">−</button>
            <button type="button" class="fw-btn" id="fw-btn-zoom-in" aria-label="Zoom in" title="Zoom in (+)">+</button>
            <button type="button" class="fw-btn-close" id="fw-btn-close" aria-label="Close (Esc)" title="Close (Esc)">×</button>
          </div>
        </header>
        <div class="fw-viewer-body" id="fw-viewer-body">
          <div class="fw-loading" id="fw-loading">Loading framework library…</div>
          <div class="fw-canvas-wrap" id="fw-canvas-wrap" style="display:none;">
            <canvas class="fw-canvas" id="fw-canvas"></canvas>
          </div>
        </div>
        <footer class="fw-viewer-footer">
          <strong>MARTI301 · Framework Sheet Library</strong> · 24 Slibraries · 120 Reference Sheets · © 2026 Dr. Hildegard Haas · EU Business School · All rights reserved
        </footer>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  /* ----- PDF.js loader --------------------------------------- */
  function loadPdfJs() {
    if (pdfjsReady) return pdfjsReady;
    pdfjsReady = new Promise((resolve, reject) => {
      if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
      const script = document.createElement('script');
      script.src = PDFJS_LIB;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('PDF.js failed to load'));
        }
      };
      script.onerror = () => reject(new Error('PDF.js failed to load'));
      document.head.appendChild(script);
    });
    return pdfjsReady;
  }

  /* ----- Rendering -------------------------------------------- */
  let zoomScale = 1.0;
  const ZOOM_MIN = 0.6;
  const ZOOM_MAX = 2.5;
  const ZOOM_STEP = 0.2;

  async function renderPage(pageNum) {
    if (!pdfDoc || isRendering) return;
    if (pageNum < 1 || pageNum > totalPages) return;
    isRendering = true;
    currentPage = pageNum;

    const loading = document.getElementById('fw-loading');
    const wrap    = document.getElementById('fw-canvas-wrap');
    const canvas  = document.getElementById('fw-canvas');
    const ctx     = canvas.getContext('2d');

    try {
      const page = await pdfDoc.getPage(pageNum);
      const containerWidth = document.getElementById('fw-viewer-body').clientWidth - 40;
      const baseViewport   = page.getViewport({ scale: 1.0 });
      const fitScale       = Math.min(containerWidth / baseViewport.width, 1.6);
      const dpr            = window.devicePixelRatio || 1;
      const viewport       = page.getViewport({ scale: fitScale * zoomScale });

      canvas.width  = Math.floor(viewport.width  * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width  = Math.floor(viewport.width)  + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      await page.render({ canvasContext: ctx, viewport }).promise;

      loading.style.display = 'none';
      wrap.style.display    = 'block';

      updateMeta(pageNum);
      updateNavButtons();
    } catch (err) {
      console.error('FW viewer render error:', err);
      loading.textContent = 'Could not load the framework sheet. Please try again.';
    } finally {
      isRendering = false;
    }
  }

  function updateMeta(pageNum) {
    const fw = FRAMEWORKS.find(f => f.page === pageNum);
    const titleEl = document.getElementById('fw-viewer-title');
    const metaEl  = document.getElementById('fw-viewer-meta');
    const indEl   = document.getElementById('fw-page-indicator');

    if (fw) {
      titleEl.textContent = fw.name;
      metaEl.textContent  = `Unit ${fw.unit} · Slibrary ${fw.slibrary} · Sheet ${fw.sheet} / 5`;
    } else if (pageNum === 1) {
      titleEl.textContent = 'Framework Sheet Library';
      metaEl.textContent  = 'MARTI301 · Master Index';
    } else if (pageNum >= 2 && pageNum <= 7) {
      const u = pageNum - 1;
      titleEl.textContent = `Master Index · Unit ${u}`;
      metaEl.textContent  = 'MARTI301 · Framework Library';
    } else if (pageNum === 8) {
      titleEl.textContent = 'How to Use This Library';
      metaEl.textContent  = 'MARTI301 · Framework Library';
    } else {
      titleEl.textContent = 'Framework Sheet';
      metaEl.textContent  = 'MARTI301 · Framework Library';
    }
    indEl.textContent = `${pageNum} / ${totalPages}`;
  }

  function updateNavButtons() {
    document.getElementById('fw-btn-prev').disabled = (currentPage <= 1);
    document.getElementById('fw-btn-next').disabled = (currentPage >= totalPages);
    document.getElementById('fw-btn-zoom-out').disabled = (zoomScale <= ZOOM_MIN + 0.01);
    document.getElementById('fw-btn-zoom-in').disabled  = (zoomScale >= ZOOM_MAX - 0.01);
  }

  /* ----- Open / close ---------------------------------------- */
  async function openPage(pageNum) {
    buildModalDOM();
    bindControlsOnce();
    const overlay = document.getElementById('fw-viewer-overlay');
    overlay.classList.add('fw-open');
    document.body.style.overflow = 'hidden';
    enableProtection();

    /* Reset to loading state */
    document.getElementById('fw-loading').style.display = 'block';
    document.getElementById('fw-loading').textContent = 'Loading framework library…';
    document.getElementById('fw-canvas-wrap').style.display = 'none';

    try {
      const pdfjsLib = await loadPdfJs();
      if (!pdfDoc) {
        const loadingTask = pdfjsLib.getDocument({
          url: PDF_PATH,
          /* Disable text/annotation extraction — we only render images */
          disableAutoFetch: false,
          disableStream: false
        });
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
      }
      zoomScale = 1.0;
      await renderPage(pageNum || 1);
    } catch (err) {
      console.error('FW viewer open error:', err);
      document.getElementById('fw-loading').textContent =
        'Could not load the framework library. Check your connection and try again.';
    }
  }

  function close() {
    const overlay = document.getElementById('fw-viewer-overlay');
    if (overlay) overlay.classList.remove('fw-open');
    document.body.style.overflow = '';
    disableProtection();
  }

  function openSlug(slug) {
    const fw = SLUG_TO_FW[slug];
    if (fw) openPage(fw.page);
    else openPage(1);
  }

  function openUnit(unitNum) {
    const p = UNIT_PAGES[unitNum] || 1;
    openPage(p);
  }

  /* ----- Controls -------------------------------------------- */
  let controlsBound = false;
  function bindControlsOnce() {
    if (controlsBound) return;
    controlsBound = true;

    document.getElementById('fw-btn-close').addEventListener('click', close);
    document.getElementById('fw-viewer-overlay').addEventListener('click', e => {
      if (e.target.id === 'fw-viewer-overlay') close();
    });
    document.getElementById('fw-btn-prev').addEventListener('click', () => {
      if (currentPage > 1) renderPage(currentPage - 1);
    });
    document.getElementById('fw-btn-next').addEventListener('click', () => {
      if (currentPage < totalPages) renderPage(currentPage + 1);
    });
    document.getElementById('fw-btn-zoom-in').addEventListener('click', () => {
      zoomScale = Math.min(ZOOM_MAX, zoomScale + ZOOM_STEP);
      renderPage(currentPage);
    });
    document.getElementById('fw-btn-zoom-out').addEventListener('click', () => {
      zoomScale = Math.max(ZOOM_MIN, zoomScale - ZOOM_STEP);
      renderPage(currentPage);
    });
  }

  /* ----- Protection layer ------------------------------------ */
  /* These handlers are attached only while the modal is open
     so they don't interfere with the rest of the site. */
  function onContextMenu(e) {
    if (e.target.closest('#fw-viewer-overlay')) {
      e.preventDefault();
      return false;
    }
  }
  function onSelectStart(e) {
    if (e.target.closest('#fw-viewer-overlay')) {
      e.preventDefault();
      return false;
    }
  }
  function onCopy(e) {
    if (document.getElementById('fw-viewer-overlay')?.classList.contains('fw-open')) {
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '');
    }
  }
  function onKeyDown(e) {
    const overlay = document.getElementById('fw-viewer-overlay');
    if (!overlay || !overlay.classList.contains('fw-open')) return;

    /* Esc closes */
    if (e.key === 'Escape') { close(); return; }

    /* Arrow keys navigate */
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      e.preventDefault();
      renderPage(currentPage - 1);
      return;
    }
    if (e.key === 'ArrowRight' && currentPage < totalPages) {
      e.preventDefault();
      renderPage(currentPage + 1);
      return;
    }

    /* Block save / print / find / view-source / dev-tools shortcuts */
    const ck = e.ctrlKey || e.metaKey;
    if (ck && ['s','p','c','x','a','f','u','j'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    if (e.key === 'F12' || (ck && e.shiftKey && ['i','c','j'].includes(e.key.toLowerCase()))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  function onDragStart(e) {
    if (e.target.closest('#fw-viewer-overlay')) {
      e.preventDefault();
      return false;
    }
  }
  function onBeforePrint() {
    document.body.classList.add('fw-printing-blocked');
    const overlay = document.getElementById('fw-viewer-overlay');
    if (overlay) overlay.style.display = 'none';
  }
  function onAfterPrint() {
    document.body.classList.remove('fw-printing-blocked');
    const overlay = document.getElementById('fw-viewer-overlay');
    if (overlay && overlay.classList.contains('fw-open')) overlay.style.display = '';
  }

  function enableProtection() {
    document.addEventListener('contextmenu', onContextMenu, true);
    document.addEventListener('selectstart',  onSelectStart, true);
    document.addEventListener('copy',         onCopy,        true);
    document.addEventListener('keydown',      onKeyDown,     true);
    document.addEventListener('dragstart',    onDragStart,   true);
    window.addEventListener('beforeprint',    onBeforePrint);
    window.addEventListener('afterprint',     onAfterPrint);
  }
  function disableProtection() {
    document.removeEventListener('contextmenu', onContextMenu, true);
    document.removeEventListener('selectstart',  onSelectStart, true);
    document.removeEventListener('copy',         onCopy,        true);
    document.removeEventListener('keydown',      onKeyDown,     true);
    document.removeEventListener('dragstart',    onDragStart,   true);
    window.removeEventListener('beforeprint',    onBeforePrint);
    window.removeEventListener('afterprint',     onAfterPrint);
  }

  /* ----- Auto-wire any element with [data-fw-slug] / [data-fw-page] / .fw-viewer-pill --- */
  function attachClickHandlers() {
    /* Pill buttons */
    document.querySelectorAll('.fw-viewer-pill').forEach(el => {
      if (el.dataset.fwBound) return;
      el.dataset.fwBound = '1';
      el.addEventListener('click', e => {
        e.preventDefault();
        const slug = el.getAttribute('data-fw-slug');
        const page = el.getAttribute('data-fw-page');
        const unit = el.getAttribute('data-fw-unit');
        if (slug)      openSlug(slug);
        else if (page) openPage(parseInt(page, 10));
        else if (unit) openUnit(parseInt(unit, 10));
        else           openPage(1);
      });
    });

    /* Framework thumbnails marked with data-fw-slug */
    document.querySelectorAll('[data-fw-slug]').forEach(el => {
      if (el.classList.contains('fw-viewer-pill')) return; /* already handled above */
      if (el.dataset.fwBound) return;
      el.dataset.fwBound = '1';
      el.classList.add('fw-clickable');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      const handler = e => {
        e.preventDefault();
        openSlug(el.getAttribute('data-fw-slug'));
      };
      el.addEventListener('click', handler);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
      });
    });

    /* Anchored thumbnails by direct page */
    document.querySelectorAll('[data-fw-page]').forEach(el => {
      if (el.classList.contains('fw-viewer-pill')) return;
      if (el.dataset.fwBound) return;
      el.dataset.fwBound = '1';
      el.classList.add('fw-clickable');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      const p = parseInt(el.getAttribute('data-fw-page'), 10);
      const handler = e => { e.preventDefault(); openPage(p); };
      el.addEventListener('click', handler);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
      });
    });
  }

  /* ----- Public API ------------------------------------------ */
  /* Namespace: window.FrameworkSheets (NOT window.FW — that name is
     already used by the existing per-unit framework data array). */
  window.FrameworkSheets = {
    openPage,
    openSlug,
    openUnit,
    close,
    list: () => FRAMEWORKS.slice(),
    get: slug => SLUG_TO_FW[slug] || null
  };

  /* ----- Init on DOM ready ----------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachClickHandlers);
  } else {
    attachClickHandlers();
  }
  /* Re-scan when content is added dynamically (best effort) */
  if (window.MutationObserver) {
    const mo = new MutationObserver(() => attachClickHandlers());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
