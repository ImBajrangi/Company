import React from 'react';

export default function PlusMinusSwitch({ checked, onChange, id }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="plus-minus-switch"
    />
  );
}
