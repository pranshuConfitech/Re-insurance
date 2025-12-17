import React, { useRef } from 'react';

import { Button } from 'primereact/button';
import { Menu as PMenu } from 'primereact/menu';

// Define Props Type
interface FettleActionMenuProps {
  menus?: {
    icon: string; label: string; onClick: () => void; disabled?: boolean
  }[]; // Make menus optional
  title?: string;
}

export const FettleActionMenu: React.FC<FettleActionMenuProps> = (props) => {
  // Explicitly type the ref to correspond to PrimeReact's Menu component
  const menuLeft = useRef<PMenu>(null);

  // Map the items for PrimeReact Menu
  const items = (props.menus ?? []).map((button) => ({
    label: button.label,
    icon: button.icon,
    disabled: button.disabled,
    command: () => {
      if (typeof button.onClick === 'function') {
        button.onClick();
      }
    },
  }));

  return (
    <div>
      {(props.menus ?? []).length > 0 && (
        <Button
          icon="pi pi-angle-down"
          // severity="secondary"
          className="mr-2"
          outlined
          style={{ width: '32px', height: '32px' }}
          onClick={(event) => menuLeft.current?.toggle(event)} // Optional chaining to handle potential null value
          aria-controls="popup_menu_left"
          aria-haspopup
          tooltip={props.title || 'Actions'}
          tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
          label="more"
        />
      )}
      {/* PrimeReact Menu */}
      <PMenu model={items} popup ref={menuLeft} id="popup_menu_left" />
    </div>
  );
};
