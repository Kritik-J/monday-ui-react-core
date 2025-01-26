/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface SoundProps extends React.SVGAttributes<SVGElement> {
size?: string | number;
}
const Sound: React.FC<SoundProps> = ({size, ...props}) => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={ size || "20" } height={ size || "20" } {...props}>
    <path fill="currentColor" d="M12.8 3.451c.33.15.61.4.81.71h.01c.19.3.3.66.3 1.03v9.64c0 .36-.1.72-.3 1.03-.2.3-.48.55-.81.71-.33.16-.7.22-1.06.19a2.05 2.05 0 0 1-.98-.36l-5.26-3.24H3.24c-.52 0-1.02-.2-1.4-.56-.37-.37-.59-.86-.59-1.39v-2.4c0-.53.21-1.03.59-1.39.38-.36.88-.56 1.4-.56H5.5l5.26-3.24c.29-.21.63-.33.98-.36.37-.04.73.03 1.06.19Zm-9.56 8.19h1.73v-3.3H3.24c-.14 0-.27.05-.36.14-.08.09-.13.2-.13.31v2.4c0 .11.04.22.13.31s.22.14.36.14Zm9.1 3.38a.39.39 0 0 0 .07-.23h-.01v-9.6c0-.08-.03-.16-.07-.23a.45.45 0 0 0-.19-.17c-.08-.05-.17-.05-.27-.05-.1.01-.19.05-.26.1-.02.01-.05.03-.05.03l-5.1 3.14v3.96l5.1 3.14.025.015a.22.22 0 0 0 .025.015c.08.06.16.1.26.1.09.01.19-.01.27-.05.09-.04.16-.1.2-.17Z"
      fillRule="evenodd" clipRule="evenodd" />
    <path fill="currentColor" d="M17.34 7.381c.44.33.8.75 1.04 1.24v-.02c.24.49.37 1.02.37 1.57s-.13 1.08-.37 1.57c-.25.49-.6.91-1.04 1.24a.749.749 0 1 1-.91-1.19c.25-.19.46-.44.6-.72.14-.28.21-.58.21-.89 0-.31-.07-.61-.21-.89-.14-.28-.34-.53-.6-.72a.749.749 0 1 1 .91-1.19Z"
    />
  </svg>
);
Sound.displayName = 'Sound';
export default Sound;
/* tslint:enable */
/* eslint-enable */
