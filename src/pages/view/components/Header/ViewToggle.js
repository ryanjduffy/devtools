import React from "react";
import classnames from "classnames";

import "./ViewToggle.css";

function ViewToggle({ viewMode, setViewMode }) {
  return (
    <button className="view-toggle">
      <div
        onClick={() => setViewMode("non-dev")}
        className={classnames("view-toggle-item view-toggle-non-dev", {
          active: viewMode === "non-dev",
        })}
      >
        VIEWER
      </div>
      <div
        onClick={() => setViewMode("dev")}
        className={classnames("view-toggle-item view-toggle-dev", {
          active: viewMode === "dev",
        })}
      >
        DEVTOOLS
      </div>
    </button>
  );
}

export default ViewToggle;
