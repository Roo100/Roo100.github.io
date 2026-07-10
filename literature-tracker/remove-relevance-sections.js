(function () {
  function ensureHiddenRelevanceInput() {
    const form = document.querySelector("#sourceForm");
    if (!form || form.querySelector("input[name='relevance']")) return;
    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "relevance";
    hidden.value = "";
    form.append(hidden);
  }

  function removeRelevanceFields() {
    ensureHiddenRelevanceInput();

    document.querySelectorAll("label").forEach((label) => {
      const text = (label.textContent || "").toLowerCase();
      if (text.includes("brief relevance to my research topic")) {
        label.remove();
      }
    });

    document.querySelectorAll(".detail-field").forEach((field) => {
      const heading = field.querySelector("h4");
      const text = (heading?.textContent || "").toLowerCase();
      if (text.includes("brief relevance to my research topic")) {
        field.remove();
      }
    });

    const template = document.querySelector("#condensedTemplate");
    if (template) {
      template.textContent = template.textContent
        .replace(/\n\s*Brief relevance to my research topic:\s*$/m, "")
        .replace(/\n\s*Brief relevance to my research topic:\s*/g, "");
    }
  }

  function withoutRelevanceMarkdown(source) {
    return `## Scholarly Article Review

### APA Citation

${source.apa || ""}

### Abstract
${source.abstract || ""}

### What is the research problem?
${source.problem || ""}

### What is the research question and/or hypothesis?
${source.researchQuestion || source.purpose || ""}

### Is the study qualitative, quantitative, or mixed methods?
${source.studyMethod || source.studyType || ""}

### What type of data is used: primary or secondary?
${source.dataType || ""}

### What is the sample size and its characteristics?
${source.sample || ""}

### What research methods or instruments were used?
${source.methodsInstruments || source.methodology || ""}

### Key Findings
${source.findings || ""}

### How it supports your claim
${source.supportClaim || ""}

### Literature Review Placement
${source.category || ""}

### Article File Status
${source.articleStatus || "Not Downloaded"}

### Project Article File
${source.articleFile || ""}`;
  }

  const patchTrackerFunctions = () => {
    if (typeof window.sourceToMarkdown === "function") {
      window.sourceToMarkdown = withoutRelevanceMarkdown;
    }

    if (typeof window.renderSources === "function" && !window.renderSources.__relevancePatched) {
      const originalRenderSources = window.renderSources;
      window.renderSources = function (...args) {
        const result = originalRenderSources.apply(this, args);
        removeRelevanceFields();
        return result;
      };
      window.renderSources.__relevancePatched = true;
    }

    if (typeof window.render === "function" && !window.render.__relevancePatched) {
      const originalRender = window.render;
      window.render = function (...args) {
        const result = originalRender.apply(this, args);
        removeRelevanceFields();
        return result;
      };
      window.render.__relevancePatched = true;
    }
  };

  patchTrackerFunctions();

  document.addEventListener("DOMContentLoaded", () => {
    patchTrackerFunctions();
    removeRelevanceFields();

    const observer = new MutationObserver(removeRelevanceFields);
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
