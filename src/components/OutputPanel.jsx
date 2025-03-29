import React, { forwardRef } from 'react';

const OutputPanel = forwardRef((props, ref) => (
    <div className="output">
        <div id="output" ref={ref}></div>
        <div id="react-output"></div>
    </div>
));

export default OutputPanel; 