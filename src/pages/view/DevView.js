import React, { useEffect } from "react";
import { connect } from "react-redux";

import { installObserver } from "protocol/graphics";
import SecondaryToolbox from "ui/components/SecondaryToolbox";
import Timeline from "ui/components/Timeline";
import Toolbox from "ui/components/Toolbox";
import Toolbar from "ui/components/Toolbar";
import Viewer from "ui/components/Viewer";
import { prefs } from "ui/utils/prefs";

import SplitBox from "devtools/client/shared/components/splitter/SplitBox";

import { updateTimelineDimensions } from "./actions/timeline";
import { selectors as appSelectors } from "ui/reducers";
import { selectors } from "./reducers";

function DevView({ updateTimelineDimensions, narrowMode }) {
  const handleMove = num => {
    updateTimelineDimensions();
    prefs.toolboxHeight = `${num}px`;
  };

  useEffect(() => {
    installObserver();
  }, []);

  if (narrowMode) {
    return (
      <>
        <SplitBox
          style={{ width: "100%", overflow: "hidden" }}
          splitterSize={1}
          initialSize={prefs.toolboxHeight}
          minSize="20%"
          maxSize="80%"
          vert={false}
          onMove={handleMove}
          startPanel={
            <div className="horizontal-panels">
              <Toolbar />
              <Toolbox />
            </div>
          }
          endPanel={<SecondaryToolbox />}
          endPanelControl={false}
        />
        <div id="timeline-container">
          <Timeline />
        </div>
      </>
    );
  }

  return (
    <div className="horizontal-panels">
      <Toolbar />
      <div className="vertical-panels">
        <SplitBox
          style={{ width: "100%", overflow: "hidden" }}
          splitterSize={1}
          initialSize={prefs.toolboxHeight}
          minSize="20%"
          maxSize="80%"
          vert={true}
          onMove={handleMove}
          startPanel={<Toolbox />}
          endPanel={<Viewer />}
          endPanelControl={false}
        />
        <div id="timeline-container">
          <Timeline />
        </div>
      </div>
    </div>
  );
}

export default connect(
  state => ({
    narrowMode: appSelectors.getNarrowMode(state),
  }),
  {
    updateTimelineDimensions,
  }
)(DevView);
