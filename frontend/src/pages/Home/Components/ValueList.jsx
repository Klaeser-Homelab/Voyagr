import React, { useEffect, useState } from 'react';
import { useValues } from '../../../context/ValuesContext';
import { useEvent } from '../../../context/EventContext';
import Identity from './Identity';
import Event from './Event';
import Onboarding from '../../Onboarding/ChapterOne';

function ValueList() {
  const { activeItem, activeEvent } = useEvent();
  const { values } = useValues();
  const [error, setError] = useState(null);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }


if(activeEvent) {
  return (
        <Event key={activeItem.id} item={activeItem} />
  );
}

if(values.length === 1 && values[0].id === 1)
{
  return (
    <div className="p-14 w-full flex flex-col gap-4 bg-black">
        <Onboarding />
      </div>
  );
}

    return (
      <div className="container p-14 w-full max-w-md flex flex-col gap-4">
        <h1 className="text-2xl text-center font-bold">What's next?</h1>
        {values.map((value) => (
          <div key={value.id}>
            <Identity value={value} />
          </div>
        ))}
      </div>
    );
  }

export default ValueList;