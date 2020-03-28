import React from 'react';
import Spinner from './Spinner';

export default function Appear({children, loadingMessage}) {

  const ref = React.useRef();
  React.useEffect(() => {
    if (children) {
      ref.current.classList.add('appear');
    } else {
      ref.current.classList.remove('appear');
    }
  }, [children]);

  return (
    <div>
      {!children ? (<Spinner>{loadingMessage}</Spinner>) : null}
      <div ref={ref} className="transparent">
        {children || null}
      </div>
    </div>
  );
}
