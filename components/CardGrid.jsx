import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";

const CardGrid = ({ projects, onSelect }) => {
  const [q, setQ] = useState("");
  const [sortMode, setSortMode] = useState("title"); // "title" | "type"

  const viewProjects = useMemo(() => {
    const query = q.trim().toLowerCase();

    const filtered = !query
      ? projects
      : projects.filter((p) => {
          const title = (p.title || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const type = (p.type || "").toLowerCase();
          const tags = (p.tags || []).join(" ").toLowerCase();
          return (
            title.includes(query) ||
            desc.includes(query) ||
            type.includes(query) ||
            tags.includes(query)
          );
        });

    const sorted = [...filtered].sort((a, b) => {
      if (sortMode === "type") {
        const t = (a.type || "").localeCompare(b.type || "", undefined, { sensitivity: "base" });
        if (t !== 0) return t;
      }
      return (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" });
    });

    return sorted;
  }, [projects, q, sortMode]);

  return (
    <div className="grid-wrap">
      <div className="grid-top">
        <div className="grid-meta">
          <div className="grid-title">Projects</div>
          <div className="grid-count">{viewProjects.length} shown</div>
        </div>

        <div className="grid-controls">
          <div className="grid-search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, type, tags…"
              className="grid-search-input"
            />
            {q && (
              <button type="button" className="grid-clear" onClick={() => setQ("")} aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          <select
            className="grid-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            aria-label="Sort projects"
          >
            <option value="title">Sort: Title (A–Z)</option>
            <option value="type">Sort: Type, then Title</option>
          </select>
        </div>
      </div>

      {viewProjects.length === 0 ? (
        <div className="grid-empty">
          <div className="grid-empty-title">No matches</div>
          <div className="grid-empty-sub">Try a different search or clear some filters.</div>
          {q && (
            <button className="grid-empty-btn" type="button" onClick={() => setQ("")}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="card-grid">
          <AnimatePresence mode="sync">
            {viewProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <ProjectCard project={project} onSelect={onSelect} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
