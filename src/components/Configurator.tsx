"use client";

import React, { useState, useRef } from "react";
import { PortfolioConfig, GridItem, TextItem, MediaItem, defaultConfig } from "../data/defaultConfig";

interface ConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioConfig;
  onChange: (newConfig: PortfolioConfig) => void;
}

export default function Configurator({
  isOpen,
  onClose,
  config,
  onChange,
}: ConfiguratorProps) {
  const [activeTab, setActiveTab] = useState<"general" | "lists" | "grid" | "code">("general");
  const [selectedGridIndex, setSelectedGridIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handlePushToDB = async () => {
    const passcode = window.prompt("Enter the Admin Passcode to push changes to the DB:");
    if (passcode === null) return; // user cancelled

    if (!passcode) {
      alert("Passcode is required.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": passcode,
        },
        body: JSON.stringify({ config }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Pushed to DB successfully!");
      } else {
        alert(`Failed to push: ${data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(`Error connecting to API: ${error.message || error}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const updateField = (field: keyof PortfolioConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  // List Item Actions
  const addListItem = (type: "films" | "music" | "fashion" | "blogs") => {
    const list = [...config[type]];
    const newNum = String(list.length + 1).padStart(2, "0");
    list.push({
      id: `${type}-${Date.now()}`,
      num: newNum,
      name: "New Entry",
      url: "#",
    });
    updateField(type, list);
  };

  const removeListItem = (
    type: "films" | "music" | "fashion" | "blogs",
    id: string
  ) => {
    const list = config[type].filter((item) => item.id !== id);
    // Re-index numbers
    const updatedList = list.map((item, idx) => ({
      ...item,
      num: String(idx + 1).padStart(2, "0"),
    }));
    updateField(type, updatedList);
  };

  const updateListItem = (
    type: "films" | "music" | "fashion" | "blogs",
    id: string,
    field: string,
    value: string
  ) => {
    const list = config[type].map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateField(type, list);
  };

  // Grid Actions
  const updateGridItem = (index: number, updatedItem: any) => {
    const items = [...config.gridItems];
    const current = items[index];

    // Type checking conversion
    let newItem: GridItem;
    if (updatedItem.type === "empty") {
      newItem = { type: "empty", id: current.id };
    } else if (updatedItem.type === "text") {
      newItem = {
        type: "text",
        id: current.id,
        num: (updatedItem.num || (current as any).num || "01"),
        symbol: (updatedItem.symbol || (current as any).symbol || "Ab"),
        name: (updatedItem.name || (current as any).name || "Stockholm, Sweden"),
        category: (updatedItem.category || (current as any).category || "PRACTICE"),
        url: updatedItem.url !== undefined ? updatedItem.url : (current as any).url,
      };
    } else {
      newItem = {
        type: "media",
        id: current.id,
        mediaUrl: (updatedItem.mediaUrl || (current as any).mediaUrl || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800"),
        mediaType: (updatedItem.mediaType || (current as any).mediaType || "image"),
        title: (updatedItem.title || (current as any).title || "Project Title"),
      };
    }

    items[index] = newItem;
    updateField("gridItems", items);
  };

  // Import / Export
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio-config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Basic validation
        if (parsed.artistName && parsed.gridItems) {
          onChange(parsed);
          alert("Portfolio configuration imported successfully!");
        } else {
          alert("Invalid configuration file format.");
        }
      } catch (err) {
        alert("Failed to parse JSON configuration file.");
      }
    };
    reader.readAsText(files[0]);
  };

  const selectedGridItem = config.gridItems[selectedGridIndex];

  return (
    <div className="configurator-overlay custom-cursor-disabled" onClick={onClose}>
      <div className="configurator" onClick={(e) => e.stopPropagation()}>
        <div className="configurator__header">
          <h2>Site Customizer</h2>
          <button onClick={onClose} className="configurator__close interactive">
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--line)",
            background: "#252525"
          }}
        >
          {(["general", "lists", "grid", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "12px",
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRight: "1px solid var(--line)",
                background: activeTab === tab ? "#2b2b2b" : "transparent",
                color: activeTab === tab ? "#f2f2f2" : "rgba(242, 242, 242, 0.45)",
                fontFamily: "var(--clash)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="configurator__content">
          {/* GENERAL INFO TAB */}
          {activeTab === "general" && (
            <div className="configurator__section">
              <h3>General Information</h3>

              <div className="config-group">
                <label>Artist Name</label>
                <input
                  type="text"
                  className="config-input"
                  value={config.artistName}
                  onChange={(e) => updateField("artistName", e.target.value)}
                />
              </div>

              <div className="config-group">
                <label>Header Initials</label>
                <input
                  type="text"
                  className="config-input"
                  maxLength={3}
                  value={config.initials}
                  onChange={(e) => updateField("initials", e.target.value)}
                />
              </div>

              <div className="config-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  className="config-input"
                  value={config.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>

              <div className="config-group">
                <label>Biography Summary</label>
                <textarea
                  className="config-input"
                  value={config.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* LISTS TAB */}
          {activeTab === "lists" && (
            <div className="configurator__section">
              <h3>Manage Publications & Links</h3>

              {(["films", "music", "fashion", "blogs"] as const).map((listType) => (
                <div key={listType} style={{ marginBottom: "2.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h4 style={{ textTransform: "uppercase", fontSize: "1.1rem", color: "var(--fg)", fontFamily: "var(--clash)", letterSpacing: "0.05em" }}>
                      {listType}
                    </h4>
                    <button
                      onClick={() => addListItem(listType)}
                      style={{ fontSize: "1.1rem", color: "#66ff66", border: "1px solid rgba(102, 255, 102, 0.3)", padding: "2px 8px" }}
                    >
                      + Add Item
                    </button>
                  </div>

                  <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid var(--line)", padding: "8px" }}>
                    {config[listType].length === 0 ? (
                      <p style={{ color: "var(--mid)", fontSize: "1.1rem", padding: "8px" }}>No items in list.</p>
                    ) : (
                      config[listType].map((item) => (
                        <div key={item.id} className="config-list-item">
                          <span style={{ fontFamily: "var(--clash)", color: "var(--mid)", marginRight: "4px" }}>{item.num}</span>
                          <input
                            type="text"
                            className="config-input"
                            style={{ padding: "4px 8px", flex: 2 }}
                            value={item.name}
                            onChange={(e) => updateListItem(listType, item.id, "name", e.target.value)}
                          />
                          <input
                            type="text"
                            className="config-input"
                            style={{ padding: "4px 8px", flex: 3 }}
                            placeholder="URL (#)"
                            value={item.url || ""}
                            onChange={(e) => updateListItem(listType, item.id, "url", e.target.value)}
                          />
                          <button
                            onClick={() => removeListItem(listType, item.id)}
                            className="config-btn-danger"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GRID LAYOUT TAB */}
          {activeTab === "grid" && (
            <div className="configurator__section">
              <h3>Gallery Grid Designer</h3>
              <p style={{ fontSize: "1.1rem", color: "var(--mid)" }}>
                Select a slot in the 10-column mini-grid to edit its type and content.
              </p>

              {/* Visual 10-column Planner */}
              <div className="configurator__grid-select">
                {config.gridItems.map((item, idx) => {
                  let cls = "";
                  if (item.type === "media") cls = "media-cell";
                  if (item.type === "text") cls = "text-cell";

                  return (
                    <button
                      key={item.id || idx}
                      onClick={() => setSelectedGridIndex(idx)}
                      className={`grid-cell-btn ${cls} ${selectedGridIndex === idx ? "active" : ""}`}
                      title={`Slot ${idx + 1}: ${item.type}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {selectedGridItem && (
                <div style={{ border: "1px solid var(--line)", padding: "16px", background: "rgba(0,0,0,0.15)", marginTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "1.1rem", textTransform: "uppercase", fontFamily: "var(--clash)", color: "var(--fg)" }}>
                      Slot {selectedGridIndex + 1} Settings
                    </span>
                    <span style={{ fontSize: "1rem", color: "var(--mid)" }}>ID: {selectedGridItem.id}</span>
                  </div>

                  {/* Grid Item Type selector */}
                  <div className="config-group" style={{ marginBottom: "1.5rem" }}>
                    <label>Slot Type</label>
                    <select
                      className="config-input"
                      value={selectedGridItem.type}
                      onChange={(e) => updateGridItem(selectedGridIndex, { type: e.target.value as any })}
                    >
                      <option value="empty">Empty Block</option>
                      <option value="text">Text Card</option>
                      <option value="media">Media (Image/Video)</option>
                    </select>
                  </div>

                  {/* Settings based on Type */}
                  {selectedGridItem.type === "text" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                      <div className="config-row">
                        <div className="config-group">
                          <label>Number Label</label>
                          <input
                            type="text"
                            className="config-input"
                            value={(selectedGridItem as TextItem).num}
                            onChange={(e) => updateGridItem(selectedGridIndex, { num: e.target.value })}
                          />
                        </div>
                        <div className="config-group">
                          <label>Symbol / Code</label>
                          <input
                            type="text"
                            className="config-input"
                            value={(selectedGridItem as TextItem).symbol}
                            onChange={(e) => updateGridItem(selectedGridIndex, { symbol: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="config-group">
                        <label>Display Name</label>
                        <input
                          type="text"
                          className="config-input"
                          value={(selectedGridItem as TextItem).name}
                          onChange={(e) => updateGridItem(selectedGridIndex, { name: e.target.value })}
                        />
                      </div>

                      <div className="config-group">
                        <label>Category Label</label>
                        <input
                          type="text"
                          className="config-input"
                          value={(selectedGridItem as TextItem).category}
                          onChange={(e) => updateGridItem(selectedGridIndex, { category: e.target.value })}
                        />
                      </div>

                      <div className="config-group">
                        <label>External Link URL (Optional)</label>
                        <input
                          type="text"
                          className="config-input"
                          value={(selectedGridItem as TextItem).url || ""}
                          onChange={(e) => updateGridItem(selectedGridIndex, { url: e.target.value || "" })}
                        />
                      </div>
                    </div>
                  )}

                  {selectedGridItem.type === "media" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                      <div className="config-group">
                        <label>Media Type</label>
                        <select
                          className="config-input"
                          value={(selectedGridItem as MediaItem).mediaType}
                          onChange={(e) => updateGridItem(selectedGridIndex, { mediaType: e.target.value as any })}
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>

                      <div className="config-group">
                        <label>Media Source URL</label>
                        <input
                          type="text"
                          className="config-input"
                          value={(selectedGridItem as MediaItem).mediaUrl}
                          onChange={(e) => updateGridItem(selectedGridIndex, { mediaUrl: e.target.value })}
                        />
                      </div>

                      <div className="config-group">
                        <label>Hover Tooltip Title</label>
                        <input
                          type="text"
                          className="config-input"
                          value={(selectedGridItem as MediaItem).title}
                          onChange={(e) => updateGridItem(selectedGridIndex, { title: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {selectedGridItem.type === "empty" && (
                    <div style={{ color: "var(--mid)", textAlign: "center", padding: "1.5rem 0", fontSize: "1.1rem" }}>
                      Empty blocks act as spacing grids to align cards.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CODE / INTEGRATION TAB */}
          {activeTab === "code" && (
            <div className="configurator__section">
              <h3>Deploy Configuration</h3>
              <p style={{ fontSize: "1.1rem", color: "var(--mid)", marginBottom: "1.5rem" }}>
                You can download the JSON configuration, place it in your project as `defaultConfig.ts`, and run this app completely customized.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <button onClick={handleExportJSON} className="btn-secondary">
                  📥 Download Config JSON
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary"
                >
                  📤 Upload Config JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportJSON}
                  accept=".json"
                  style={{ display: "none" }}
                />
              </div>

              <div style={{ marginTop: "2rem" }}>
                <label style={{ fontSize: "1.1rem", textTransform: "uppercase", color: "var(--mid)", display: "block", marginBottom: "0.8rem" }}>
                  Generated configuration code snippet
                </label>
                <div style={{ position: "relative" }}>
                  <pre
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      padding: "12px",
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      overflowX: "auto",
                      maxHeight: "220px",
                      border: "1px solid var(--line)"
                    }}
                  >
                    {JSON.stringify(config, null, 2)}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                      alert("Config JSON copied to clipboard!");
                    }}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "8px",
                      background: "rgba(242, 242, 242, 0.15)",
                      color: "var(--fg)",
                      padding: "4px 8px",
                      fontSize: "0.9rem",
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="configurator__actions" style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
          <button
            onClick={handlePushToDB}
            disabled={isSaving}
            className="btn-primary"
            style={{ 
              width: "100%", 
              background: "#4caf50", 
              borderColor: "#4caf50",
              color: "#fff",
              opacity: isSaving ? 0.6 : 1,
              cursor: isSaving ? "not-allowed" : "pointer"
            }}
          >
            {isSaving ? "Pushing..." : "Push to DB"}
          </button>
          
          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all configurations to defaults?")) {
                  onChange(defaultConfig);
                }
              }} 
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Reset to Defaults
            </button>
            <button onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Close & Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
