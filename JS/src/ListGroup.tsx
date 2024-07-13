import { useState } from "react";

interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: React.BaseSyntheticEvent) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  const list = items;
  const [active, updateActive] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      <ul className="list-group">
        {list.map((item, index) => (
          <li
            className={
              active === index ? "list-group-item active" : "list-group-item"
            }
            key={item}
            onClick={(event) => {
              updateActive(index);
              onSelectItem(event);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
