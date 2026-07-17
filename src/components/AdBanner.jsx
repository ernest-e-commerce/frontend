import { useMemo } from "react";

// Renders one Adsterra "iframe" unit inside its own document (via srcDoc) so
// each unit gets an isolated `atOptions` global — otherwise multiple units on
// the same page overwrite each other and render blank / at the wrong size.
const AdBanner = ({ unit, label = "Sponsored", className = "" }) => {
  const { key: adKey, width, height } = unit;

  const srcDoc = useMemo(
    () =>
      `<!doctype html><html><head><meta charset="utf-8">` +
      `<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>` +
      `</head><body>` +
      `<script type="text/javascript">atOptions={"key":"${adKey}","format":"iframe","height":${height},"width":${width},"params":{}};</` +
      `script>` +
      `<script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></` +
      `script>` +
      `</body></html>`,
    [adKey, width, height]
  );

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {label && (
        <span className="self-start text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </span>
      )}
      <iframe
        title="Advertisement"
        aria-label="Advertisement"
        srcDoc={srcDoc}
        width={width}
        height={height}
        scrolling="no"
        loading="lazy"
        className="block max-w-full rounded-md bg-gray-100"
        style={{ border: 0, width, height }}
      />
    </div>
  );
};

export default AdBanner;
